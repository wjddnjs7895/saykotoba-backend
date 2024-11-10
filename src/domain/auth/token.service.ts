import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { TokenRequestDto, TokenResponseDto } from './dtos/token.dto';
import {
  TokenGenerateFailedException,
  RefreshTokenSaveException,
  InvalidRefreshTokenException,
  ExpiredRefreshTokenException,
  RefreshTokenFailedException,
} from '@exception/custom-exception/auth.exception';
import { CustomException } from '@/common/exception/custom.exception';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

      return payload.sub;
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

  async revokeRefreshToken(tokenId: number) {
    await this.refreshTokenRepository.update(
      { id: tokenId },
      { isRevoked: true },
    );
  }
}
