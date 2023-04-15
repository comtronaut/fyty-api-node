import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { UserAvatarService } from "../user/avatar.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [],
  controllers: [ ReviewController ],
  providers: [ ReviewService, UserAvatarService, PrismaService ]
})
export class ReviewModule {}
