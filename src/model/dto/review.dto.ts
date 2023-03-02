import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateReviewDto implements Prisma.ReviewUncheckedCreateInput {
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
