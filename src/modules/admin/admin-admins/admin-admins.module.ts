import { Module } from "@nestjs/common";
import { UserService } from "modules/user/user.service";
import { AdminController } from "./admin-admins.controller";
import { AdminService } from "./admin-admins-service";

@Module({
  controllers: [ AdminController ],
  providers: [ UserService, AdminService ]
})
export class AdminAdminsModule {}
