import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { LineUpController } from "./lineUp/lineUp.controller";
import { LineUpService } from "./lineUp/lineUp.service";
import { TeamMemberService } from "./members/team-member.service";
import { TeampendingService } from "./pending/teampending.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { NotifyService } from "../line_notify/lineNotify.service";

@Module({
  imports: [],
  controllers: [ TeamController, LineUpController ],
  providers: [
    TeamService,
    LineUpService,
    TeamMemberService,
    TeampendingService,
    PrismaService,
    NotifyService
  ]
})
export class TeamModule {}
