import { Prisma } from ".prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsISO8601,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID
} from "class-validator";

export class CreateAppointmentDto
implements Prisma.AppointmentUncheckedCreateInput
{
  @IsNotEmpty()
  teamIds: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsISO8601()
  startAt: Date;

  @IsISO8601()
  endAt: Date;
}

export class UpdateAppointmentDto
implements Prisma.AppointmentUncheckedUpdateInput
{
  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional()
  startAt?: Date;

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional()
  endAt?: Date;
}
