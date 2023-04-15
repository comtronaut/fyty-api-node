import { Prisma } from ".prisma/client";
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsUrl
} from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateGameDto implements Prisma.GameUncheckedCreateInput {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  teamCap: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
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
