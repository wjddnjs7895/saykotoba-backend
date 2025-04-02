import { Controller } from '@nestjs/common';
import { VocaFacade } from '../application/voca.facade';
@Controller('voca')
export class VocaController {
  constructor(private readonly vocaFacade: VocaFacade) {}
}
