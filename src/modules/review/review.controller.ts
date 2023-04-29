import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CreateReviewDto, UpdateReviewDto } from "model/dto/review.dto";
import { ReviewService } from "./review.service";
import { UserJwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller("reviews")
@UseGuards(UserJwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() payload: CreateReviewDto) {
    return await this.reviewService.createReview(payload);
  }

  @Get()
  async getReview(@Query() revieweeId: UpdateReviewDto) {
    return await this.reviewService.getReviewFilter(revieweeId);
  }

  @Get(":id")
  async getReviewById(@Param("id") id: string) {
    return await this.reviewService.getReviewById(id);
  }
}
