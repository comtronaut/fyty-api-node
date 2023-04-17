import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateReviewDto, UpdateReviewDto } from "src/model/dto/review.dto";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() payload: CreateReviewDto) {
    return await this.reviewService.createReview(payload);
  }

  @Get("")
  async getReview(@Query() revieweeId: UpdateReviewDto) {
    return await this.reviewService.getReviewFilter(revieweeId);
  }

  @Get(":id")
  async getReviewById(@Param("id") id: string) {
    return await this.reviewService.getReviewById(id);
  }
}
