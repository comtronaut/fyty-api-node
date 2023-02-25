import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  ratingScore: number;

  @IsNotEmpty()
  reviewerId: string;

  @IsNotEmpty()
  revieweeId: string;

  @IsNotEmpty()
  gameId: string;

  createdAt: Date;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
