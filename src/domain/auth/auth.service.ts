import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto, LoginResponseDto } from './dtos/login.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginRequestDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getAccessToken(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return this.jwtService.sign(payload);
  }

  async getRefreshToken(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return this.jwtService.sign(payload);
  }

  async generateAuthTokens(
    loginDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(loginDto),
      this.getRefreshToken(loginDto),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(
    registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(registerDto.password, saltOrRounds);
    const newUser = await this.usersService.createUser({
      username: registerDto.email,
      email: registerDto.email,
      password: hashPassword,
      userTypeId: 1,
    });
    return { userId: newUser.userId };
  }
}
