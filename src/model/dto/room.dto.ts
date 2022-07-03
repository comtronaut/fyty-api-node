import { PartialType } from "@nestjs/mapped-types";
import { IsDate, IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { RoomStatus } from "src/common/_enum";

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(RoomStatus)
  status: string;

  option: string;

  startAt: Date;
  
  endAt: Date;

  // @IsNotEmpty()
  // nMatches: number;

  teamCount: number;

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

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;
  
  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) { }