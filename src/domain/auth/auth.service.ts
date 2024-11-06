import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dtos/login.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { MoreThan, Repository, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenRequestDto, TokenResponseDto } from './dtos/token.dto';
import {
  ExpiredRefreshTokenException,
  InvalidRefreshTokenException,
  LogoutFailedException,
  PasswordNotMatchException,
  RefreshTokenFailedException,
  RefreshTokenSaveException,
  TokenGenerateFailedException,
  UserNotFoundException,
  TokenCleanupFailedException,
} from '@exception/custom-exception/auth.exception';
import { CustomException } from '@/common/exception/custom.exception';
import { EmailAlreadyExistsException } from '@/common/exception/custom-exception/auth.exception';
import { PasswordHashFailedException } from '@/common/exception/custom-exception/auth.exception';
import { RegisterFailedException } from '@/common/exception/custom-exception/auth.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginRequestDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);
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

  async generateAccessToken(tokenRequestDto: TokenRequestDto) {
    const secret = this.configService.get('JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get('JWT_ACCESS_EXPIRATION');

    const payload = {
      email: tokenRequestDto.email,
      sub: tokenRequestDto.userId,
      type: 'access',
    };
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async generateRefreshToken(tokenRequestDto: TokenRequestDto) {
    try {
      const secret = this.configService.get('JWT_REFRESH_SECRET');
      const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION');

      const payload = {
        email: tokenRequestDto.email,
        sub: tokenRequestDto.userId,
        type: 'refresh',
      };
      return this.jwtService.sign(payload, {
        secret,
        expiresIn,
      });
    } catch {
      throw new TokenGenerateFailedException();
    }
  }

  async generateAndSaveAuthTokens(
    tokenRequestDto: TokenRequestDto,
  ): Promise<TokenResponseDto> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(tokenRequestDto),
        this.generateRefreshToken(tokenRequestDto),
      ]);

      await this.saveRefreshToken(refreshToken, tokenRequestDto.userId);

      return {
        accessToken,
        refreshToken,
      };
    } catch {
      throw new TokenGenerateFailedException();
    }
  }

  private async saveRefreshToken(refreshToken: string, userId: number) {
    const refreshTokenEntity = new RefreshTokenEntity();
    refreshTokenEntity.refreshToken = refreshToken;
    refreshTokenEntity.userId = userId;

    const expirationString = this.configService.get('JWT_REFRESH_EXPIRATION');
    let expirationMs: number;

    if (expirationString.endsWith('d')) {
      expirationMs = parseInt(expirationString) * 24 * 60 * 60 * 1000;
    } else {
      expirationMs = parseInt(expirationString) * 1000;
    }

    refreshTokenEntity.expiresAt = new Date(Date.now() + expirationMs);
    refreshTokenEntity.updatedAt = new Date();
    refreshTokenEntity.isRevoked = false;

    try {
      await this.refreshTokenRepository.save(refreshTokenEntity);
    } catch {
      throw new RefreshTokenSaveException();
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const storedRefreshToken = await this.refreshTokenRepository.findOne({
        where: {
          userId: payload.sub,
          refreshToken,
          isRevoked: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!storedRefreshToken) {
        throw new InvalidRefreshTokenException();
      }

      const user = await this.usersService.findUserById(payload.sub);

      if (!user) {
        throw new UserNotFoundException();
      }

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateAccessToken({
          email: user.email,
          userId: user.id,
        }),
        this.generateRefreshToken({
          email: user.email,
          userId: user.id,
        }),
      ]);

      await this.refreshTokenRepository.update(
        { id: storedRefreshToken.id },
        { isRevoked: true },
      );

      await this.saveRefreshToken(newRefreshToken, user.id);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }

      if (error?.name === 'JsonWebTokenError') {
        throw new InvalidRefreshTokenException();
      }

      if (error?.name === 'TokenExpiredError') {
        throw new ExpiredRefreshTokenException();
      }

      throw new RefreshTokenFailedException();
    }
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

  async register(
    registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const existingUser = await this.usersService.findUserByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    let hashPassword: string;
    try {
      const saltOrRounds = 10;
      hashPassword = await bcrypt.hash(registerDto.password, saltOrRounds);
    } catch {
      throw new PasswordHashFailedException();
    }

    try {
      const newUser = await this.usersService.createUser({
        username: registerDto.email,
        email: registerDto.email,
        password: hashPassword,
        userTypeId: 1,
      });

      return { userId: newUser.userId };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new RegisterFailedException();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    try {
      const result = await this.refreshTokenRepository.delete({
        expiresAt: LessThan(new Date()),
      });

      this.logger.log(
        `Cleaned up ${result.affected || 0} expired refresh tokens`,
      );
    } catch (error) {
      this.logger.error('Failed to cleanup expired tokens', error);
      throw new TokenCleanupFailedException();
    }
  }
}
