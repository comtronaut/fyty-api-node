import { Module } from "@nestjs/common";
import { UserAvatarService } from "./avatar.service";
import { UserSettingsService } from "./settings.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [],
  controllers: [ UserController ],
  providers: [ UserService, UserAvatarService, UserSettingsService ]
})
export class UserModule {}
