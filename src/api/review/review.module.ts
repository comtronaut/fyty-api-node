import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/model/sql-entity/user/user.entity";
import { Review } from "src/model/sql-entity/user/review.entity";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { UserAvatarService } from "../users/user-avatars/avatar.service";
import { UserAvatar } from "src/model/sql-entity/user/userAvatar.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Review , UserAvatar ])
  ],
  controllers: [ ReviewController ],
  providers: [ ReviewService, UserAvatarService ]
})

export class ReviewModule { }
