import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocaController } from './presentation/voca.controller';
import { VocaJpEntity } from './domain/entities/voca-jp.entity';
import { VocaAdminFacade } from './application/voca-admin.facade';
import { VocaStrategyProvider } from './infrastructure/providers/voca-strategy.provider';
import { VocaFacade } from './application/voca.facade';
import { VocaService } from './domain/services/voca.service';
import { VocaAdminService } from './domain/services/voca-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([VocaJpEntity])],
  controllers: [VocaController],
  providers: [
    VocaStrategyProvider,
    VocaAdminService,
    VocaAdminFacade,
    VocaService,
    VocaFacade,
  ],
  exports: [VocaService],
})
export class VocaModule {}
