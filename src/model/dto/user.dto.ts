import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";

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
  
    // @ApiPropertyOptional({ default: 5.00 })
    // ratingScore: number;
  
    @ApiPropertyOptional()
    profileImageUrl: string;
  
    @ApiPropertyOptional()
    coverUrl: string;
  
  //   prefId: string;
    
  //   availableFeatureId: string;
  
  //   premiumId: string;
  
  //   inventoryId: string;

    @IsNotEmpty()
    @IsNumber()
    phoneNumber: string
  
    @ApiPropertyOptional({ description: "auto generated" })
    createdAt: Date;
  }

export class UpdateUserDto extends PartialType(CreateUserDto) { }