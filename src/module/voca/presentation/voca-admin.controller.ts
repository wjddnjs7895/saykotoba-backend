import { Controller, Post, Body } from '@nestjs/common';
import { Admin } from '@/common/decorators/admin.decorator';
import { CreateVocaBaseDto } from '../application/dtos/create-voca-base.dto';
import { VocaAdminFacade } from '../application/voca-admin.facade';

@Controller('voca-admin')
@Admin()
export class VocaAdminController {
  constructor(private readonly vocaAdminFacade: VocaAdminFacade) {}

  @Post()
  async createVoca(@Body() createVocaDto: CreateVocaBaseDto) {
    return this.vocaAdminFacade.createVoca({ createVocaDto });
  }
}
