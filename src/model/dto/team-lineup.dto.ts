import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTeamLineupDto implements Prisma.TeamLineupUncheckedCreateInput {
  @IsUUID()
  teamId: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  isDefault: boolean;

  @IsOptional()
  inGameId: string;

  @IsOptional()
  imageUrl: string;
}

export class UpdateLineUpDto extends PartialType(CreateTeamLineupDto) {}

export const schemas = validationMetadatasToSchemas();
