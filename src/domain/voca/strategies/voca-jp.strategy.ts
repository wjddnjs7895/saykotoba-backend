import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VocaJpEntity } from '../entities/voca-jp.entity';
import { VocaStrategy } from './voca-strategy.interface';
import { CreateVocaJpDto } from '../dtos/create-voca-jp.dto';
import { DifficultyJpStrategy } from './difficulty-jp.interface';
import { InvalidDifficultyException } from '@/common/exception/custom-exception/voca.exception';

@Injectable()
export class VocaJpStrategy implements VocaStrategy {
  constructor(
    @InjectRepository(VocaJpEntity)
    private readonly vocaJpRepository: Repository<VocaJpEntity>,
    private readonly difficultyJpStrategy: DifficultyJpStrategy,
  ) {}

  findAll(): Promise<VocaJpEntity[]> {
    return this.vocaJpRepository.find();
  }

  create({
    createVocaDto,
  }: {
    createVocaDto: CreateVocaJpDto;
  }): Promise<VocaJpEntity> {
    if (
      !this.difficultyJpStrategy.validateDifficulty(createVocaDto.difficulty)
    ) {
      throw new InvalidDifficultyException();
    }
    const parsedDifficulty = this.difficultyJpStrategy.parseDifficulty(
      createVocaDto.difficulty,
    );
    const voca = this.vocaJpRepository.create({
      ...createVocaDto,
      difficulty: parsedDifficulty,
    });
    return this.vocaJpRepository.save(voca);
  }
}
