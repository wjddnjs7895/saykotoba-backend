import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolvers';

@Module({
  providers: [UsersResolver],
})
export class UsersModule {}
