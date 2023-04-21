import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTeamSettingsDto implements Prisma.TeamSettingsUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsBoolean()
  isJoiningEnabled: boolean;
}

export class UpdateTeamSettingsDto extends PartialType(CreateTeamSettingsDto) {}

export const schemas = validationMetadatasToSchemas();
