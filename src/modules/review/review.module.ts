import { Module } from "@nestjs/common";

import { PrismaService } from "prisma/prisma.service";

import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { UserAvatarService } from "../user/avatar.service";

@Module({
  imports: [],
  controllers: [ ReviewController ],
  providers: [ ReviewService, UserAvatarService, PrismaService ]
})
export class ReviewModule {}
