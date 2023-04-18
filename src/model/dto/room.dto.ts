import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsUUID
} from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateRoomDto implements Prisma.RoomUncheckedCreateInput {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @IsNotEmpty()
  @IsISO8601()
  startAt: Date;

  @IsNotEmpty()
  @IsISO8601()
  endAt: Date;

  @IsNotEmpty()
  @IsArray()
  teamLineupIds: string[];

  @IsNotEmpty()
  gameId: string;

  @IsOptional()
  note: string;

  @IsNotEmpty()
  @IsUUID()
  hostTeamId: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

export class DeleteRoomDto {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsUUID()
  teamId: string;
}

export const schemas = validationMetadatasToSchemas();
