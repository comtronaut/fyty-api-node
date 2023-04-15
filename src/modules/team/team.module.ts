import { Module } from "@nestjs/common";
import { NotifyService } from "../notification/lineNotify.service";
import { LineupController } from "./lineup.controller";
import { LineupService } from "./lineup.service";
import { TeamMemberService } from "./member.service";
import { TeampendingService } from "./pending.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [],
  controllers: [ TeamController, LineupController ],
  providers: [ TeamService, LineupService, TeamMemberService, TeampendingService, NotifyService ]
})
export class TeamModule {}
