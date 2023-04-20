import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTeamSetting implements Prisma.TeamSettingUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsBoolean()
  isJoiningEnabled: Boolean;
}

export class UpdateTeamSetting extends PartialType(CreateTeamSetting) {
    @IsNotEmpty()
    @IsUUID()
    id: string
}

export const schemas = validationMetadatasToSchemas();
