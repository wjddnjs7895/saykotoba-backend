import { Injectable } from '@nestjs/common';
import { VocaAdminService } from '../module/voca/services/voca-admin.service';
import { CreateVocaBaseDto } from '../module/voca/dtos/create-voca-base.dto';

@Injectable()
export class VocaAdminFacade {
  constructor(private readonly vocaAdminService: VocaAdminService) {}

  async createVoca(createVocaDto: CreateVocaBaseDto): Promise<any> {
    return this.vocaAdminService.createVoca({ createVocaDto });
  }
}
