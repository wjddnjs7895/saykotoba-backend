import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entity/character.entity';
import { Repository } from 'typeorm';
import { CreateCharacterRequestDto } from './dto/create-character.dto';
import {
  CharacterNotFoundException,
  CharacterSaveFailedException,
} from '@/common/exception/custom-exception/character.exception';
import { getCharacteristicString } from './utils/characteristic';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(CharacterEntity)
    private readonly characterRepository: Repository<CharacterEntity>,
  ) {}

  async getCharacters() {
    const characters = await this.characterRepository.find();
    if (!characters) {
      throw new CharacterNotFoundException();
    }
    return characters;
  }

  async getCharacteristicByName({ name }: { name: string }): Promise<string> {
    const characteristic = await this.characterRepository.findOne({
      where: { name },
    });
    if (!characteristic) {
      return '';
    }
    return getCharacteristicString(characteristic);
  }

  async createCharacter(body: CreateCharacterRequestDto) {
    const character = await this.characterRepository.save(body);
    if (!character) {
      throw new CharacterSaveFailedException();
    }
    return character;
  }
}
