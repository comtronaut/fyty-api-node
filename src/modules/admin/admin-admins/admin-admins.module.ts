import { Module } from "@nestjs/common";

import { UserService } from "modules/user/services/user.service";

import { AdminAdminsController } from "./admin-admins.controller";
import { AdminAdminsService } from "./admin-admins.service";

@Module({
  controllers: [ AdminAdminsController ],
  providers: [ UserService, AdminAdminsService ]
})
export class AdminAdminsModule {}
