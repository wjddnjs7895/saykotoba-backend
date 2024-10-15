import { ArgsType, Field } from '@nestjs/graphql';
import { IsNumber, IsString, IsBoolean, Length } from 'class-validator';

@ArgsType()
export class CreateUserDto {
  @Field(() => Number)
  @IsNumber()
  id: number;

  @Field(() => String)
  @IsString()
  @Length(5, 10)
  password: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => Boolean)
  @IsBoolean()
  isPayed: boolean;
}
