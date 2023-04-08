import { Prisma } from ".prisma/client";
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsNumberString, IsString, IsUrl } from "class-validator";

export class CreateGameDto implements Prisma.GameUncheckedCreateInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
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

  @IsString()
  desc: string;
}

export class UpdateGameDto extends PartialType(CreateGameDto) {}
