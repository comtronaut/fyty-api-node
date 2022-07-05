import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { RoomStatus } from "src/common/_enum";

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  option: string;

  @ApiPropertyOptional()
  startAt: Date;
  
  @ApiPropertyOptional()
  endAt: Date;

  // @IsNotEmpty()
  // nMatches: number;

  teamCount: number;

  @IsNotEmpty()
  gameId: string;

  @IsNotEmpty()
  hostId: string;

}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }

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