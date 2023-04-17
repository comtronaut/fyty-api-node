import { Prisma } from ".prisma/client";
import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsArray, IsISO8601, IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateAppointmentDto implements Prisma.AppointmentUncheckedCreateInput {
  @IsNotEmpty()
  @IsArray()
  teamIds: string[];

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsISO8601()
  startAt: Date;

  @IsNotEmpty()
  @IsISO8601()
  endAt: Date;
}

export class UpdateAppointmentDto extends PartialType(
  PickType(CreateAppointmentDto, [ "startAt", "endAt" ] as const)
) {}

export const schemas = validationMetadatasToSchemas();
