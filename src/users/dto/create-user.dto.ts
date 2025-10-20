import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateTwitterDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateTwitterDto)
  twitter?: CreateTwitterDto;
}
