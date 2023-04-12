import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto implements Prisma.UserUncheckedCreateInput {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  displayName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  bio: string;

  @ApiPropertyOptional()
  portraitUrl: string;

  @ApiPropertyOptional()
  coverUrl: string;

  @IsNotEmpty()
  phoneNumber: string;

  lineToken?: string | null;

  lastLoginAt: Date;

  firstLoginAt: Date;

  @ApiPropertyOptional({ description: "auto generated" })
  createdAt: Date;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class CreateUserAvatarDto
implements Prisma.UserAvatarUncheckedCreateInput
{
  @IsNotEmpty()
  characterName: string;

  @IsNotEmpty()
  ingameId: string;

  @IsNotEmpty()
  rank: string;

  ratingScore: number;

  @IsNotEmpty()
  gameId: string;

  @IsNotEmpty()
  userId: string;

  createdAt: Date;
}

export class UpdateUserAvatarDto extends PartialType(CreateUserAvatarDto) {}
