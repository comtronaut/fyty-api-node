import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import {
  IsEmail,
  IsISO8601,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MinLength
} from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateUserDto implements Prisma.UserUncheckedCreateInput {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  @IsUrl()
  portraitUrl: string;

  @IsOptional()
  @IsUrl()
  coverUrl: string;

  @IsNotEmpty()
  @IsMobilePhone("th-TH")
  mobilePhone: string;

  @IsOptional()
  lineToken?: string;

  @IsOptional()
  @IsISO8601()
  lastLoginAt: Date;

  @IsOptional()
  @IsISO8601()
  firstLoginAt: Date;

  @IsOptional()
  @IsISO8601()
  createdAt: Date;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export const schemas = validationMetadatasToSchemas();
