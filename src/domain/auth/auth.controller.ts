import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { RegisterRequestDto, RegisterResponseDto } from './dtos/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginRequestDto, LoginResponseDto } from './dtos/login.dto';
import { RefreshRequestDto, RefreshResponseDto } from './dtos/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginRequestDto,
    @Request() req,
  ): Promise<LoginResponseDto> {
    const tokenResponse = await this.authService.generateAndSaveAuthTokens({
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
    return this.authService.register(registerDto);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
