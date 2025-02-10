import { Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { LocalLoginRequestDto } from './dtos/local.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LogoutFailedException,
  PasswordNotMatchException,
  UserNotFoundException,
  GoogleOAuthFailedException,
  GoogleIdTokenVerifyFailedException,
  AppleIdTokenVerifyFailedException,
} from '@exception/custom-exception/auth.exception';
import { EmailAlreadyExistsException } from '@/common/exception/custom-exception/auth.exception';
import { PasswordHashFailedException } from '@/common/exception/custom-exception/auth.exception';
import {
  GoogleLoginRequestDto,
  GoogleLoginResponseDto,
  GoogleTokenPayloadDto,
} from './dtos/google.dto';
import { OAuth2Client } from 'google-auth-library';
import {
  AppleLoginRequestDto,
  AppleLoginResponseDto,
  AppleTokenPayloadDto,
} from './dtos/apple.dto';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { AppleOAuthFailedException } from '@/common/exception/custom-exception/auth.exception';
import { TokenService } from './token.service';
import { AppleUtils } from './utils/apple.utils';
import { AuthProvider, UserRole } from '@/common/constants/user.constants';
import { OnboardingService } from '../user/services/onboarding.service';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private jwksClient: JwksClient;
  private appleUtils: AppleUtils;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly onboardingService: OnboardingService,
  ) {
    this.jwksClient = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
      cache: true,
      rateLimit: true,
      requestHeaders: {},
    });

    this.appleUtils = new AppleUtils(this.configService);
    this.appleUtils.validateAppleConfigs();
  }

  async validateAuthentication(loginDto: LocalLoginRequestDto) {
    const user = await this.userService.findUserForAuth(loginDto.email);
    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new PasswordNotMatchException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async logout(userId: number) {
    try {
      await this.refreshTokenRepository.update(
        { userId, isRevoked: false },
        { isRevoked: true },
      );
      return true;
    } catch {
      throw new LogoutFailedException();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      const saltOrRounds = 10;
      return await bcrypt.hash(password, saltOrRounds);
    } catch {
      throw new PasswordHashFailedException();
    }
  }

  async registerAndLogin(
    registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const existingUser = await this.userService.findUserByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const userData = {
      email: registerDto.email,
      name: registerDto.name,
      provider: registerDto.provider,
      role: UserRole.USER,
    };

    if (registerDto.provider === AuthProvider.LOCAL) {
      const hashedPassword = await this.hashPassword(registerDto.password);
      console.log('registerDto.password', registerDto.password);
      console.log('hashedPassword', hashedPassword);
      Object.assign(userData, { password: hashedPassword });
    } else if (registerDto.provider === AuthProvider.GOOGLE) {
      Object.assign(userData, { googleId: registerDto.googleId });
    } else if (registerDto.provider === AuthProvider.APPLE) {
      Object.assign(userData, { appleId: registerDto.appleId });
    }

    const newUser = await this.userService.createUser(userData);

    const tokens = await this.tokenService.generateAndSaveAuthTokens({
      email: newUser.email,
      userId: newUser.userId,
      role: newUser.role,
    });

    return {
      ...tokens,
      isOnboardingCompleted: false,
    };
  }

  async loginWithGoogle(
    googleLoginRequestDto: GoogleLoginRequestDto,
  ): Promise<GoogleLoginResponseDto> {
    if (!googleLoginRequestDto) {
      throw new GoogleOAuthFailedException();
    }
    const payload = await this.verifyGoogleIdToken(
      googleLoginRequestDto.idToken,
    );

    const { email, name, sub: googleId } = payload;

    const existingUser = await this.userService.findUserByEmail(email);

    if (!existingUser) {
      return await this.registerAndLogin({
        email,
        name,
        googleId,
        provider: AuthProvider.GOOGLE,
      });
    }

    const tokens = await this.tokenService.generateAndSaveAuthTokens({
      email: existingUser.email,
      userId: existingUser.id,
      role: existingUser.role,
    });

    return {
      ...tokens,
      isOnboardingCompleted: await this.onboardingService.isOnboardingCompleted(
        existingUser.id,
      ),
    };
  }

  private async verifyGoogleIdToken(
    idToken: string,
  ): Promise<GoogleTokenPayloadDto> {
    const client = new OAuth2Client();
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: [
          this.configService.get('GOOGLE_IOS_CLIENT_ID'),
          this.configService.get('GOOGLE_EXPO_CLIENT_ID'),
        ],
      });
      const payload = ticket.getPayload();
      return payload as GoogleTokenPayloadDto;
    } catch {
      throw new GoogleIdTokenVerifyFailedException();
    }
  }

  async loginWithApple(
    appleLoginDto: AppleLoginRequestDto,
  ): Promise<AppleLoginResponseDto> {
    try {
      const payload = await this.verifyAppleToken(appleLoginDto.idToken);
      const { email, sub: appleId } = payload;

      const existingUser = await this.userService.findUserByEmail(email);

      if (!existingUser) {
        const name = appleLoginDto.fullName
          ? `${appleLoginDto.fullName.firstName} ${appleLoginDto.fullName.lastName}`.trim()
          : null;
        return await this.registerAndLogin({
          email,
          name,
          appleId,
          provider: AuthProvider.APPLE,
        });
      }

      const tokens = await this.tokenService.generateAndSaveAuthTokens({
        email: existingUser.email,
        userId: existingUser.id,
        role: existingUser.role,
      });

      return {
        ...tokens,
        isOnboardingCompleted:
          await this.onboardingService.isOnboardingCompleted(existingUser.id),
      };
    } catch {
      throw new AppleOAuthFailedException();
    }
  }

  private async verifyAppleToken(token: string): Promise<AppleTokenPayloadDto> {
    try {
      console.log('Verifying token:', token);
      const decodedToken = jwt.decode(token, { complete: true });
      if (!decodedToken) {
        throw new AppleIdTokenVerifyFailedException();
      }

      const signingKey = await this.jwksClient.getSigningKey(
        decodedToken.header.kid,
      );

      const publicKey = signingKey.getPublicKey();

      const validAudiences = ['host.exp.Exponent', 'com.joeygarden.saykotoba'];
      const result = await verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: validAudiences,
      });

      const typedPayload = result as AppleTokenPayloadDto;
      if (!typedPayload.sub || !typedPayload.email) {
        throw new AppleIdTokenVerifyFailedException();
      }

      return typedPayload;
    } catch (error) {
      console.error('Apple token verification error:', error);
      throw new AppleIdTokenVerifyFailedException();
    }
  }
}
