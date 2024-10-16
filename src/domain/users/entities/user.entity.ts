import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => Number)
  @Column()
  id: number;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Boolean)
  @Column()
  isPayed: boolean;
}
