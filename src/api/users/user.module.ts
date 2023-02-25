import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserAvatarService } from "./user-avatars/avatar.service";
import { PrismaService } from "src/services/prisma.service";

@Module({
  imports: [],
  controllers: [ UserController ],
  providers: [ UserService, UserAvatarService, PrismaService ]
})
export class UserModule {}
