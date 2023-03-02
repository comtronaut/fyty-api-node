import { Prisma } from ".prisma/client";
import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumberString, IsString, IsUrl } from "class-validator";

export class CreateGameDto implements Prisma.GameUncheckedCreateInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  teamCap: number;

  @IsNumberString()
  @IsNotEmpty()
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
