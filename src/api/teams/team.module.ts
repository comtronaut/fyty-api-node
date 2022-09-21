import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { TeamLineUp } from "src/model/sql-entity/team/lineUp.entity";
import { TeamPending } from "src/model/sql-entity/team/pending.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { LineUpController } from "./lineUp/lineUp.controller";
import { LineUpService } from "./lineUp/lineUp.service";
import { TeamMemberService } from "./members/team-member.service";
import { TeampendingService } from "./pending/teampending.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Team, TeamLineUp, TeamMember, TeamPending, RoomLineup, RoomLineupBoard, RoomParticipant ])
  ],
  controllers: [ TeamController, LineUpController ],
  providers: [ TeamService, LineUpService, TeamMemberService, TeampendingService ]
})
export class TeamModule { }
