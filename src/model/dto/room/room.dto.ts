import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateRoomDto implements Prisma.RoomUncheckedCreateInput {
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  startAt: Date;

  @ApiPropertyOptional()
  endAt: Date;

  // @IsNotEmpty()
  teamlineUpIds: string;

  @IsNotEmpty()
  gameId: string;

  note: string;

  @IsNotEmpty()
  hostId: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

// participant

export class CreateParticipantDto
implements Prisma.RoomParticipantUncheckedCreateInput
{
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  gameId: string;

  @IsNotEmpty()
  @IsUUID()
  roomLineUpBoardId: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {}

// RoomNote

export class UpdateRoomNoteDto {
  topic: string;

  body: string;
}

export class CreateRoomNoteDto {
  @ApiPropertyOptional()
  roomId: string;

  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional()
  body: string;
}

export class DeleteRoomDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  teamId: string;
}
