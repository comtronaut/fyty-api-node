import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUrl,
  IsUUID
} from "class-validator";

export class CreateAppointmentDto {
  @IsNotEmpty()
  teamIds: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @ApiPropertyOptional()
  startAt: Date;

  @ApiPropertyOptional()
  endAt: Date;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional()
  startAt: Date;

  @ApiPropertyOptional()
  endAt: Date;
}
