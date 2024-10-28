import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterRequestDto, RegisterResponseDto } from './dtos/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginRequestDto, LoginResponseDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.generateAuthTokens(loginDto);
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
