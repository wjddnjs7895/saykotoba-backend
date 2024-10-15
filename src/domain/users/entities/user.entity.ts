import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  isPayed: boolean;
}
