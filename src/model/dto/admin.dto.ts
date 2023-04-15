import { PartialType } from "@nestjs/mapped-types";
import { AdminRole, Prisma } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateAdminDto implements Prisma.AdminUncheckedCreateInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role: AdminRole;
}

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

export const schemas = validationMetadatasToSchemas();
