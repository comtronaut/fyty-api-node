import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AdminTeamsController } from "./admin-teams.controller";
import { AdminTeamsService } from "./admin-teams.service";

@Module({
  controllers: [ AdminTeamsController ],
  providers: [ AdminTeamsService, PrismaService ]
})
export class AdminTeamsModule {}
