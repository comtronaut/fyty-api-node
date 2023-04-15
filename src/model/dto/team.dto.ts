import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsUUID, IsUrl } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTeamDto implements Prisma.TeamUncheckedCreateInput {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl()
  coverUrl: string;

  @IsOptional()
  @IsUrl()
  logoUrl: string;

  @IsNotEmpty()
  gameId: string;

  @IsNotEmpty()
  @IsUUID()
  founderId: string;
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export const schemas = validationMetadatasToSchemas();
