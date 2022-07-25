import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Subject } from "src/common/subject.decorator";
import { ReviewService } from "./review.service";
import { User } from "src/model/sql-entity/user/user.entity";
import { CreateReviewDto, UpdateReviewDto } from "src/model/dto/review.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";

@Controller("api/review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
   ) { }

  @Post("")
  async createReview(
    @Body() req: CreateReviewDto) {
    return this.reviewService.createReview(req);
  }

  @Get(":id")
  async getReviewByRevieweeId(
    @Param("id") revieweeId: string) {
    return this.reviewService.getReviewByRevieweeId(revieweeId);
  }

  @Get(":id")
  async getReviewByReviewerId(
    @Param("id") reviewerId: string) {
    return this.reviewService.getReviewByReviewerId(reviewerId);
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
