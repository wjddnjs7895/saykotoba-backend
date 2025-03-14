import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterRequestDto, RegisterResponseDto } from './dtos/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalLoginRequestDto, LocalLoginResponseDto } from './dtos/local.dto';
import { RefreshRequestDto, RefreshResponseDto } from './dtos/refresh.dto';
import {
  GoogleLoginRequestDto,
  GoogleLoginResponseDto,
} from './dtos/google.dto';
import { TokenService } from './token.service';
import { AppleLoginRequestDto, AppleLoginResponseDto } from './dtos/apple.dto';
import { AuthProvider } from '@/common/constants/user.constants';
import { UserEntity } from '../user/entities/user.entity';
import { User } from '@/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.registerAndLogin({
      provider: AuthProvider.LOCAL,
      ...registerDto,
    });
  }

  @Post('logout')
  async logout(
    @User() user: UserEntity,
    @Body() body: { refreshToken: string },
  ) {
    return this.authService.logout(user.id, body.refreshToken);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async localLogin(
    @Body() loginDto: LocalLoginRequestDto,
    @Request() req,
  ): Promise<LocalLoginResponseDto> {
    const tokenResponse = await this.tokenService.generateAndSaveAuthTokens({
      email: loginDto.email,
      userId: req.user.id,
      role: req.user.role,
    });
    return tokenResponse;
  }

  @Public()
  @Post('google')
  async googleLogin(
    @Body() googleLoginRequestDto: GoogleLoginRequestDto,
  ): Promise<GoogleLoginResponseDto> {
    return this.authService.loginWithGoogle(googleLoginRequestDto);
  }

  @Public()
  @Post('apple')
  async appleLogin(
    @Body() appleLoginRequestDto: AppleLoginRequestDto,
  ): Promise<AppleLoginResponseDto> {
    return this.authService.loginWithApple(appleLoginRequestDto);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() refreshDto: RefreshRequestDto,
  ): Promise<RefreshResponseDto> {
    return this.tokenService.refreshTokens(refreshDto.refreshToken);
  }

  @Get('validate')
  async validateAccessToken(@User() user: UserEntity): Promise<boolean> {
    return this.authService.isValidateUser({ userId: user.id });
  }
}
