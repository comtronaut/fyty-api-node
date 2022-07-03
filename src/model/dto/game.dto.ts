import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumberString, IsString, IsUrl } from "class-validator";

export class CreateGameDto {
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

  @IsString()
  @IsNotEmpty()
  abbr: string;
}

export class UpdateGameDto extends PartialType(CreateGameDto) { }