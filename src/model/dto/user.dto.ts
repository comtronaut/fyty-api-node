import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Min } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string;
  
    @ApiProperty()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty()
    @IsNotEmpty()
    displayName: string;
  
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiPropertyOptional()
    bio: string;
  
    @ApiPropertyOptional()
    portraitUrl: string;
  
    @ApiPropertyOptional()
    coverUrl: string;

    @IsNotEmpty()
    phoneNumber: string;
  
    @ApiPropertyOptional({ description: "auto generated" })
    createdAt: Date;
  }

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class CreateUserAvatarDto {

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

export class UpdateUserAvatarDto extends PartialType(CreateUserAvatarDto) { }