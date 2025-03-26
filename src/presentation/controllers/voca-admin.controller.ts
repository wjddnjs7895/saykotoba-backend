import { Controller, Post, Body } from '@nestjs/common';
import { VocaAdminService } from '../../domain/voca/services/voca-admin.service';
import { CreateVocaBaseDto } from '../../domain/voca/dtos/create-voca-base.dto';
import { Admin } from '@/common/decorators/admin.decorator';

@Controller('voca-admin')
@Admin()
export class VocaAdminController {
  constructor(private readonly vocaAdminService: VocaAdminService) {}

  @Post()
  async createVoca(@Body() createVocaDto: CreateVocaBaseDto) {
    return this.vocaAdminService.createVoca({ createVocaDto });
  }
}
