import { Body, Controller, Get, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterRequestDto } from './dto/create-character.dto';
import { Admin } from '@/common/decorators/admin.decorator';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  async getCharacters() {
    return this.characterService.getCharacters();
  }

  @Admin()
  @Post()
  async createCharacter(@Body() body: CreateCharacterRequestDto) {
    return this.characterService.createCharacter(body);
  }
}
