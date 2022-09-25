import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  startAt: Date;
  
  @ApiPropertyOptional()
  endAt: Date;

  teamCount: number;

  @IsNotEmpty()
  teamlineUpIds: string;

  @IsNotEmpty()
  gameId: string;

  note: string;

  @IsNotEmpty()
  hostId: string;

}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }

// participant

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;
  
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsUUID()
  gameId: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) { }

// RoomNote

export class UpdateRoomNoteDto {

  topic: string;

  body: string;
}

export class CreateRoomNoteDto  {
  
  @ApiPropertyOptional()
  roomId: string;

  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional()
  body: string;

}

