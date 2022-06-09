import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamMember } from "src/model/sql-entity/team-member.entity";
import { Team } from "src/model/sql-entity/team.entity";
import { TeamMemberService } from "./members/team-member.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Team, TeamMember ])
  ],
  controllers: [ TeamController ],
  providers: [ TeamService, TeamMemberService ]
})
export class TeamModule { }
