import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PasswordResetSessionController } from "./password-reset-sessions.controller";
import { PasswordResetSessionService } from "./password-reset-sessions.service";

@Module({
  imports: [],
  controllers: [ PasswordResetSessionController ],
  providers: [ PasswordResetSessionService, PrismaService ]
})
export class PasswordResetSessionModule {}
