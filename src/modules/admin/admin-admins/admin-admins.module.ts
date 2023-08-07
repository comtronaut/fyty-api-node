import { Module } from "@nestjs/common";

import { UserService } from "modules/user/services/user.service";

import { AdminService } from "./admin-admins-service";
import { AdminController } from "./admin-admins.controller";

@Module({
  controllers: [ AdminController ],
  providers: [ UserService, AdminService ]
})
export class AdminAdminsModule {}
