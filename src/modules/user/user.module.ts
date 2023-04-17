import { Module } from "@nestjs/common";
import { UserAvatarService } from "./avatar.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [],
  controllers: [ UserController ],
  providers: [ UserService, UserAvatarService ]
})
export class UserModule {}
