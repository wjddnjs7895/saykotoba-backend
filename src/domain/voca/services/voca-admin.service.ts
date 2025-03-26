import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CreateVocaBaseDto } from '../dtos/create-voca-base.dto';
import { VocaStrategy } from '../strategies/voca-strategy.interface';

@Injectable()
export class VocaAdminService {
  constructor(
    @Inject('VOCA_STRATEGY_MAP')
    private readonly vocaStrategyMap: Map<string, VocaStrategy>,
  ) {}

  async createVoca({
    createVocaDto,
  }: {
    createVocaDto: CreateVocaBaseDto;
  }): Promise<any> {
    const strategy = this.vocaStrategyMap.get(createVocaDto.language);
    if (!strategy) {
      throw new BadRequestException('Invalid language');
    }
    return strategy.create(createVocaDto);
  }
}
