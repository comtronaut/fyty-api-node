import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { UserAvatarService } from "../users/user-avatars/avatar.service";
import { PrismaService } from "src/services/prisma.service";

@Module({
  imports: [],
  controllers: [ ReviewController ],
  providers: [ ReviewService, UserAvatarService, PrismaService ]
})
export class ReviewModule {}
