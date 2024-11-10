import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dtos/create-user.dto';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return { userId: newUser.id, email: newUser.email };
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserForAuth(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'provider'],
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    await this.userRepository.update(id, updateUserDto);
    return { userId: id };
  }

  async removeUser(id: number) {
    return await this.userRepository.delete(id);
  }
}
