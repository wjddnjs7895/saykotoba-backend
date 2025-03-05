import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { UserModule } from './domain/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { ConversationModule } from './domain/conversation/conversation.module';
import { OpenAIModule } from './integrations/openai/openai.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './domain/auth/guards/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AwsModule } from './integrations/aws/aws.module';
import { GoogleModule } from './integrations/google/google.module';
import * as fs from 'fs';
import { LectureModule } from './domain/lecture/lecture.module';
import { CharacterModule } from './domain/character/character.module';
import { SystemModule } from './domain/system/system.module';
import { PaymentModule } from './domain/payment/payment.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? 'config/env/.env.prod'
          : 'config/env/.env.dev',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
        AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_CLOUDFRONT_DOMAIN: Joi.string().required(),
        GOOGLE_EXPO_CLIENT_ID: Joi.string().required(),
        GOOGLE_IOS_CLIENT_ID: Joi.string().required(),
        GOOGLE_TTS_API_KEY: Joi.string().required(),
        GOOGLE_TTS_CLIENT_EMAIL: Joi.string().required(),
        GOOGLE_IAP_CLIENT_EMAIL: Joi.string().required(),
        GOOGLE_IAP_API_KEY: Joi.string().required(),
        GOOGLE_ANDROID_CLIENT_ID: Joi.string().required(),
        APPLE_CLIENT_ID: Joi.string().required(),
        APPLE_TEAM_ID: Joi.string().required(),
        APPLE_STORE_ISSUER_ID: Joi.string().required(),
        APPLE_STORE_KEY_ID: Joi.string().required(),
        APPLE_STORE_PRIVATE_KEY: Joi.string().required(),
        APPLE_SHARED_SECRET: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.string().default('1h'),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        OPEN_AI_API_KEY: Joi.string().required(),
        OPEN_AI_PROJECT_ID: Joi.string().required(),
        IOS_LATEST_VERSION: Joi.string().required(),
        IOS_FORCE_UPDATE: Joi.boolean().required(),
        IOS_STORE_URL: Joi.string().required(),
        ANDROID_LATEST_VERSION: Joi.string().required(),
        ANDROID_FORCE_UPDATE: Joi.boolean().required(),
        ANDROID_STORE_URL: Joi.string().required(),
        TERMS_OF_USE: Joi.string().required(),
        PRIVACY_POLICY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: false, //configService.get('NODE_ENV') !== 'production',
        logging: false, //configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        ssl: {
          ca: fs.readFileSync('config/ssl/global-bundle.pem'),
        },
        extra: {
          ssl: { rejectUnauthorized: false },
        },
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ConversationModule,
    LectureModule,
    OpenAIModule,
    AwsModule,
    GoogleModule,
    CharacterModule,
    SystemModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
