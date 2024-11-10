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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

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
    });
    return tokenResponse;
  }

  @Post('refresh')
  async refresh(
    @Body() refreshDto: RefreshRequestDto,
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }

  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.registerAndLogin(registerDto);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
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
}
