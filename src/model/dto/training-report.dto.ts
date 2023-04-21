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

export class CreateTrainingReportDto implements Prisma.TrainingReportUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  reporterUserId: string;

  @IsNotEmpty()
  @IsUUID()
  reporterTeamId: string;

  @IsNotEmpty()
  @IsUUID()
  trainingId: string;

  @IsOptional()
  @IsBoolean()
  isAdminReviewed: boolean;

  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  imageUrls: string[];

  @IsOptional()
  @IsISO8601()
  createdAt: Date;
}

export class UpdateTrainingReportDto extends PartialType(CreateTrainingReportDto) {}

export const schemas = validationMetadatasToSchemas();
