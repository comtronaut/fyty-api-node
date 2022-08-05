import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateReviewDto, UpdateReviewDto } from "src/model/dto/review.dto";
import { ReviewService } from "./review.service";

@Controller("api/review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) { }

  @Post()
  async createReview(
    @Body() req: CreateReviewDto) {
    return this.reviewService.createReview(req);
  }

  @Get("")
  async getReview(
    @Query() revieweeId: UpdateReviewDto) {
    return this.reviewService.getReviewFilter(revieweeId);
  }
  
  @Get(":id")
  async getReviewById(
    @Param("id") id: string) {
    return this.reviewService.getReviewById(id);
  }

  // @Put("/review/:id")
  // async updateReview(
  //   @Param("id") reviewerId: string,
  //   @Body() req: UpdateReviewDto ,) {
  //   return this.reviewService.update(reviewerId, req);
  // }

  // @Delete("/:id")
  // async daleteReview(
  //   @Param("id") revieweId: string,) {
  //   return this.reviewService.deleteReview(revieweId);
  // }
}
