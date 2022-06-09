import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsNotEmpty } from "class-validator";
import { RoomStatus } from "src/common/_enum";

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(RoomStatus)
  status: string;

  option: string;

  @IsNotEmpty()
  // startAt: Date;
  startAt: string;

  @IsNotEmpty()
  nMatches: number;

  participantCount: number;

  @IsNotEmpty()
  gameId: string;

  hostId: string;

  @IsNotEmpty()
  chatId: string;
  
  createdAt: Date;

  @IsNotEmpty()
  teamId: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }