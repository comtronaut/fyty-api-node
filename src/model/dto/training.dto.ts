import { PartialType } from "@nestjs/mapped-types";
import { Prisma, TrainingStatus } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID
} from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTrainingDto implements Prisma.TrainingUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  appointmentId: string;

  @IsOptional()
  @IsUUID()
  hostId: string;

  @IsOptional()
  @IsUUID()
  guestId: string;

  @IsOptional()
  @IsInt()
  hostWinCount: number;

  @IsOptional()
  @IsInt()
  hostLoseCount: number;

  @IsOptional()
  note: string;

  @IsOptional()
  @IsEnum(TrainingStatus)
  status: TrainingStatus;

  @IsNotEmpty()
  @IsArray()
  imageUrls: string[];

  @IsNotEmpty()
  @IsBoolean()
  isSubmitted: boolean;

  @IsOptional()
  @IsISO8601()
  updatedAt: Date;

  @IsOptional()
  @IsISO8601()
  createdAt: Date;
}

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {}

export const schemas = validationMetadatasToSchemas();
