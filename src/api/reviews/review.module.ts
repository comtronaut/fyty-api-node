import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "src/model/sql-entity/review.entity";
import { User } from "src/model/sql-entity/user.entity";
import { UserReviewService } from "../users/user-reviews/user-review.service";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Review, User ])
  ],
  controllers: [ ReviewController ],
  providers: [ ReviewService, UserReviewService ]
})
export class ReviewModule { }
