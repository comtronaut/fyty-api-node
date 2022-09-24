import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchDetail } from "src/model/sql-entity/team/statistic/matchDetail.entity";
import { MatchHistory } from "src/model/sql-entity/team/statistic/matchHistory.entity";
import { TeamStatistic } from "src/model/sql-entity/team/statistic/stat.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeamStatisticService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(TeamStatistic) private teamStatModel: Repository<TeamStatistic>,
    @InjectRepository(MatchHistory) private matchHistoryModel: Repository<MatchHistory>,
    @InjectRepository(MatchDetail) private matchDetailModel: Repository<MatchDetail>,
  ) { }
  
    async getTeamStat(teamId: string){
        try {
          return await this.teamStatModel.findOneByOrFail({ id: teamId });
        } 
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async getMatches(teamId: string){
      try {
        let hostedMatches = [MatchHistory];
        let guestedmatches = [MatchHistory];

        // find both that ur make a matches on host and guest

        return{
          hostedMatches: hostedMatches,
          guestedmatches: guestedmatches
        };
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async getMatchesWithOpponent(yourTeamId: string, OpponentTeamId: string){ // opponent teamId
      try {
        
        let matches = [MatchHistory];

        // find all matches that u make with the opponent

        return matches;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async updateMatch(matchId: string){ 
      try {
        
        let match = null;

        // update and return the updated match 

        return match;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

}