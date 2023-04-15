import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTeamLineupDto implements Prisma.TeamLineupUncheckedCreateInput {
  @IsUUID()
  teamId: string;

  @IsOptional()
  @IsBoolean()
  isDefault: boolean;

  @IsOptional()
  inGameId: string;

  @IsOptional()
  imageUrl: string;
}

export class UpdateLineUpDto extends PartialType(CreateTeamLineupDto) {}

export const schemas = validationMetadatasToSchemas();
