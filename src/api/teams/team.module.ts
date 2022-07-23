import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamLineUp } from "src/model/sql-entity/team/lineUp.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { LineUpController } from "./lineUp/lineUp.controller";
import { LineUpService } from "./lineUp/lineUp.service";
import { TeamMemberService } from "./members/team-member.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Team, TeamLineUp,TeamMember])
  ],
  controllers: [ TeamController, LineUpController ],
  providers: [ TeamService, LineUpService,TeamMemberService ]
})
export class TeamModule { }
