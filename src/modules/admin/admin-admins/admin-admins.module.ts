import { Module } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import { AdminController } from "./admin-admins.controller";

@Module({
  controllers: [ AdminController ],
  providers: [ UserService ]
})
export class AdminAdminsModule {}
