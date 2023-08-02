import { Module } from "@nestjs/common";

import { PrismaService } from "prisma/prisma.service";

import { UserRecoverySessionController } from "./password-reset-sessions.controller";
import { UserRecoverySessionService } from "./password-reset-sessions.service";

@Module({
  imports: [],
  controllers: [ UserRecoverySessionController ],
  providers: [ UserRecoverySessionService, PrismaService ]
})
export class UserRecoverySessionModule {}
