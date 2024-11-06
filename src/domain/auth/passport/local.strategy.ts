import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser({ email, password });
      if (!user) {
        throw new UnauthorizedException(
          '이메일 또는 비밀번호가 잘못되었습니다.',
        );
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
