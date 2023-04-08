import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AdminGamesModule } from "./admin-games/admin-games.module";
import { AdminUsersModule } from "./admin-users/admin-users.module";

@Module({
  controllers: [ AdminController ],
  providers: [ AdminService, PrismaService ],
  imports: [ AdminGamesModule, AdminUsersModule ]
})
export class AdminModule {}
