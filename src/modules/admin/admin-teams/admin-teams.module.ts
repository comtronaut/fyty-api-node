import { Module } from "@nestjs/common";
import { TeamService } from "src/modules/team/team.service";
import { AdminTeamsController } from "./admin-teams.controller";

@Module({
  controllers: [ AdminTeamsController ],
  providers: [ TeamService ]
})
export class AdminTeamsModule {}
