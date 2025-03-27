import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocaController } from '@/presentation/controllers/voca.controller';
import { VocaService } from './services/voca.service';
import { VocaJpEntity } from './domain/entities/voca-jp.entity';
import { VocaJpRepository } from '@/infrastructure/repositories/voca/voca-jp.repository';
import { VocaJpStrategy } from './strategies/voca-jp.strategy';
import { DifficultyJpStrategy } from './strategies/difficulty-jp.interface';
import { VocaStrategyProvider } from '@/infrastructure/providers/voca-strategy.provider';
import { VocaAdminService } from './services/voca-admin.service';
import { VocaAdminController } from '@/presentation/controllers/voca-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VocaJpEntity])],
  controllers: [VocaController, VocaAdminController],
  providers: [
    VocaService,
    VocaJpRepository,
    VocaJpStrategy,
    DifficultyJpStrategy,
    VocaStrategyProvider,
    VocaAdminService,
  ],
})
export class VocaModule {}
