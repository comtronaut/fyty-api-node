import { Module } from "@nestjs/common";

import { UserRecoverySessionController } from "./controllers/recovery-session.controller";
import { UserController } from "./controllers/user.controller";
import { UserAvatarService } from "./services/avatar.service";
import { UserRecoverySessionService } from "./services/recovery-session.service";
import { UserService } from "./services/user.service";

@Module({
  imports: [],
  controllers: [ UserController, UserRecoverySessionController ],
  providers: [ UserService, UserAvatarService, UserRecoverySessionService ]
})
export class UserModule {}
