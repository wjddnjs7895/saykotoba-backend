// src/voca/repositories/voca-jp.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VocaJpEntity } from '@/module/voca/domain/entities/voca-jp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVocaJpDto } from '@/module/voca/application/dtos/create-voca-jp.dto';
import { VocaBaseRepository } from './voca-base.repository';
@Injectable()
export class VocaJpRepository extends VocaBaseRepository<VocaJpEntity> {
  constructor(
    @InjectRepository(VocaJpEntity)
    private readonly repo: Repository<VocaJpEntity>,
  ) {}

  async createAndSave({
    dto,
  }: {
    dto: CreateVocaJpDto;
  }): Promise<VocaJpEntity> {
    const voca = this.repo.create(dto);
    return await this.repo.save(voca);
  }

  async findAll(): Promise<VocaJpEntity[]> {
    return await this.repo.find();
  }

  async findById({ id }: { id: number }): Promise<VocaJpEntity> {
    return await this.repo.findOne({ where: { id } });
  }
}
