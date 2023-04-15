import { PartialType } from "@nestjs/mapped-types";
import { Lang, Prisma } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateUserSettingsDto
implements Prisma.UserSettingsUncheckedCreateInput
{
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsEnum(Lang)
  lang: Lang;
}

export class UpdateUserSettingsDto extends PartialType(CreateUserSettingsDto) {}

export const schemas = validationMetadatasToSchemas();
