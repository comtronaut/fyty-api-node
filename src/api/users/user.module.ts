import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserAvatarService } from "./user-avatars/avatar.service";
import { PrismaService } from "src/services/prisma.service";
import { UserSettingsService } from "./user-settings/user-settings.service";

@Module({
  imports: [],
  controllers: [ UserController ],
  providers: [
    UserService,
    UserAvatarService,
    UserSettingsService,
    PrismaService
  ]
})
export class UserModule {}
