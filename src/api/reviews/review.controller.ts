import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { Subject } from "src/common/subject.decorator";
import { CreateReviewDto } from "src/model/dto/review.dto";
import { User } from "src/model/sql-entity/user.entity";
import { ReviewService } from "./review.service";

@Controller("api/reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  // only admin can add game
  @Debug()
  @Post()
  async addReview(@Body() req: CreateReviewDto) {
    return this.reviewService.create(req);
  }

  @Debug()
  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async getSelfReview(@Subject() user: User) {
    return this.reviewService.getSelf(user);
  }

  // @Debug()
  // @Delete("/:gameId")
  // async deleteUser(@Param("gameId") gameId: string) {    
  //   return await this.gameService.delete(gameId);
  // }
}
