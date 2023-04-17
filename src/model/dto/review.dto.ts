import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateReviewDto implements Prisma.ReviewUncheckedCreateInput {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  ratingScore: number;

  @IsNotEmpty()
  @IsUUID()
  reviewerId: string;

  @IsNotEmpty()
  @IsUUID()
  revieweeId: string;

  @IsNotEmpty()
  gameId: string;

  @IsOptional()
  @IsISO8601()
  createdAt: Date;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

export const schemas = validationMetadatasToSchemas();
