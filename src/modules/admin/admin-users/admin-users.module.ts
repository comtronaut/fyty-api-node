import { Module } from "@nestjs/common";
import { UserService } from "modules/user/user.service";
import { AdminUsersController } from "./admin-users.controller";

@Module({
  controllers: [ AdminUsersController ],
  providers: [ UserService ]
})
export class AdminUsersModule {}
