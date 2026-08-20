import {
  IsRequired,
  IsString,
  IsEmail,
  IsNumber,
  MinLength,
  IsStrongPassword,
} from "../decorators/validators";

import {
  IsAdult,
} from "../decorators/custom";

import {
  Transform,
} from "../decorators/transform";

export class CreateUserDto {
  @IsRequired()
  @IsString()
  @MinLength(2)
  name!: string;

  @IsRequired()
  @IsEmail()
  email!: string;

  @IsRequired()
  @Transform(
    (value) => Number(value)
  )
  @IsNumber()
  @IsAdult()
  age!: number;

  @IsRequired()
  @IsString()
  @IsStrongPassword()
  password!: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  name?: string;

  @IsEmail()
  email?: string;

  @Transform(
    (value) => Number(value)
  )
  @IsNumber()
  @IsAdult()
  age?: number;

  @IsString()
  @IsStrongPassword()
  password?: string;
}