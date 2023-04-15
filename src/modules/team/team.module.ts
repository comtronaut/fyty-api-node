import { Module } from "@nestjs/common";
import { NotifyService } from "../notification/lineNotify.service";
import { LineUpController } from "./lineup.controller";
import { LineUpService } from "./lineup.service";
import { TeamMemberService } from "./member.service";
import { TeampendingService } from "./pending.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [],
  controllers: [ TeamController, LineUpController ],
  providers: [
    TeamService,
    LineUpService,
    TeamMemberService,
    TeampendingService,
    NotifyService
  ]
})
export class TeamModule {}
