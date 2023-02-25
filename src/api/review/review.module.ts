import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { UserAvatarService } from "../users/user-avatars/avatar.service";
import { PrismaService } from "src/services/prisma.service";

@Module({
  imports: [ PrismaService ],
  controllers: [ ReviewController ],
  providers: [ ReviewService, UserAvatarService ]
})
export class ReviewModule {}
