import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dtos/create-user.dto';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  findUserById(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }
}
