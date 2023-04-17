import { Prisma } from ".prisma/client";
import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty, IsUrl } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateGameDto implements Prisma.GameUncheckedCreateInput {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  teamCap: number;

  @IsInt()
  @IsNotEmpty()
  lineupCap: number;

  @IsUrl()
  @IsNotEmpty()
  logoUrl: string;

  @IsUrl()
  @IsNotEmpty()
  coverUrl: string;

  @IsNotEmpty()
  desc: string;
}

export class UpdateGameDto extends PartialType(CreateGameDto) {}

export const schemas = validationMetadatasToSchemas();
