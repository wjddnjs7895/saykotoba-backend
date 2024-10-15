import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Resolver(() => User)
export class UsersResolver {
  @Query(() => [User])
  getAllUser(@Args('payedOnly') payedOnly: boolean): User[] {
    return [];
  }
  @Mutation(() => Boolean)
  createUser(@Args() createUserInput: CreateUserDto): boolean {
    console.log(createUserInput);
    return true;
  }
}
