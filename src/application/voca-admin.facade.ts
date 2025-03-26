import { Injectable } from '@nestjs/common';
import { VocaAdminService } from '../domain/voca/services/voca-admin.service';
import { CreateVocaBaseDto } from '../domain/voca/dtos/create-voca-base.dto';

@Injectable()
export class VocaAdminFacade {
  constructor(private readonly vocaAdminService: VocaAdminService) {}

  async createVoca(createVocaDto: CreateVocaBaseDto): Promise<any> {
    return this.vocaAdminService.createVoca({ createVocaDto });
  }
}
