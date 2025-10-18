import {
  IsEmail,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateTwitterDto {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  refresh_token?: string;
}

class UpdateUserDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateTwitterDto)
  twitter?: UpdateTwitterDto;
}

export { UpdateUserDto };
