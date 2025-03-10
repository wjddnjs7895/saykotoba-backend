import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dtos/create-user.dto';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dtos/update-user.dto';
import { GetUserInfoRespondDto } from './dtos/get-user-info.dto';
import { UserEntity } from './entities/user.entity';
import { User } from '@/common/decorators/user.decorator';
import { UpdateUserOnboardingRequestDto } from './dtos/update-user-onboarding.dto';
import { OnboardingService } from './services/onboarding.service';
import { GetInterestListResponseDto } from './dtos/get-interest.dto';
import { LogParams } from '@/common/decorators/log-params.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly onboardingService: OnboardingService,
  ) {}

  @Post()
  @LogParams()
  createUser(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @LogParams()
  getUserInfo(@User() user: UserEntity): Promise<GetUserInfoRespondDto> {
    return this.userService.getUserInfo(user.id);
  }

  @Patch(':id')
  @LogParams()
  updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @LogParams()
  removeUser(@Param('id') id: number) {
    return this.userService.removeUser(id);
  }

  @Get('tier-list')
  @LogParams()
  getTierList(): Promise<{
    tierList: { tier: string; threshold: number }[];
  }> {
    return this.userService.getTierList();
  }

  @Post('onboarding')
  @LogParams()
  updateUserOnboarding(
    @User() user: UserEntity,
    @Body() updateUserOnboardingDto: UpdateUserOnboardingRequestDto,
  ) {
    return this.onboardingService.updateUserOnboarding(
      user.id,
      updateUserOnboardingDto,
    );
  }

  @Get('interest-list')
  @LogParams()
  getInterestList(): Promise<GetInterestListResponseDto> {
    return this.onboardingService.getInterestList();
  }

  @Delete('withdraw')
  @LogParams()
  async withdrawUser(@User() user: UserEntity): Promise<{ success: boolean }> {
    await this.userService.withdrawUser(user.id);
    return { success: true };
  }
}
