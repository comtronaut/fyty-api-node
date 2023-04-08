import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AdminRole, Prisma } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAdminDto implements Prisma.AdminUncheckedCreateInput {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiPropertyOptional()
    role: AdminRole;
  }
  
  export class UpdateAdminDto extends PartialType(CreateAdminDto) {}