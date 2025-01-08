import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { UsersModule } from './domain/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { ConversationModule } from './domain/conversation/conversation.module';
import { OpenaiModule } from './integrations/openai/openai.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './domain/auth/guards/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AwsModule } from './integrations/aws/aws.module';
import { GoogleModule } from './integrations/google/google.module';
import * as fs from 'fs';

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
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.string().default('1h'),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        APPLE_CLIENT_ID: Joi.string().required(),
        APPLE_TEAM_ID: Joi.string().required(),
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
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        // ssl: {
        //   ca: fs.readFileSync('config/ssl/global-bundle.pem'),
        // },
        // extra: {
        //   ssl: { rejectUnauthorized: false },
        // },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ConversationModule,
    OpenaiModule,
    AwsModule,
    GoogleModule,
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
