import { Module } from "@nestjs/common";

import { PrismaService } from "prisma/prisma.service";

import { UserRecoverySessionController } from "./user-recovery-session.controller";
import { UserRecoverySessionService } from "./user-recovery-session.service";

@Module({
  imports: [],
  controllers: [ UserRecoverySessionController ],
  providers: [ UserRecoverySessionService, PrismaService ]
})
export class UserRecoverySessionModule {}
