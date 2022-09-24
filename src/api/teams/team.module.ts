import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { TeamLineUp } from "src/model/sql-entity/team/lineUp.entity";
import { TeamPending } from "src/model/sql-entity/team/pending.entity";
import { GameHistory } from "src/model/sql-entity/team/statistic/gameHistory.entity";
import { MatchDetail } from "src/model/sql-entity/team/statistic/matchDetail.entity";
import { MatchHistory } from "src/model/sql-entity/team/statistic/matchHistory.entity";
import { TeamStatistic } from "src/model/sql-entity/team/statistic/stat.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { LineUpController } from "./lineUp/lineUp.controller";
import { LineUpService } from "./lineUp/lineUp.service";
import { TeamMemberService } from "./members/team-member.service";
import { TeampendingService } from "./pending/teampending.service";
import { GameHistortService } from "./statistic/gameHistory.service";
import { StatisticController } from "./statistic/statistic.controller";
import { TeamStatisticService } from "./statistic/statistic.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Team, TeamLineUp, TeamMember, 
                                TeamPending, TeamStatistic, RoomLineup, 
                                  RoomLineupBoard, RoomParticipant, MatchDetail, MatchHistory,
                                    GameHistory ])
  ],
  controllers: [ TeamController, LineUpController, StatisticController ],

  providers: [ TeamService, LineUpService, TeamMemberService, 
                TeampendingService, GameHistortService, TeamStatisticService ]
})
export class TeamModule { }
