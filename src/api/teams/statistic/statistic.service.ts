import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateMatchHistoryDto } from "src/model/dto/statistic.dto";
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
        let hostedMatches = this.matchHistoryModel.findBy({hostId: teamId});
        let guestedmatches = this.matchHistoryModel.findBy({guestId: teamId});

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
        
        let matchesMy = this.matchHistoryModel.findBy({ hostId: yourTeamId, guestId: OpponentTeamId });
        let matchesOppo = this.matchHistoryModel.findBy({ hostId: OpponentTeamId, guestId: yourTeamId });
        let matches = [];
        matches.push(matchesMy, matchesOppo);
        // find all matches that u make with the opponent

        return matches;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async updateMatch(matchId: string, req: UpdateMatchHistoryDto){ 
      try {
        let oldmatch = await this.matchHistoryModel.findOneByOrFail({ id: matchId });
        let stathost = await this.teamStatModel.findOneByOrFail({ teamId: req.hostId });
        let statguest = await this.teamStatModel.findOneByOrFail({ teamId: req.guestId });
        let match = this.matchHistoryModel.update({ id: matchId }, req);

        if(req.hostWin != oldmatch.hostWin){
          let numhostwin = stathost.win - oldmatch.hostWin + req.hostWin;
          let numhostlose = stathost.lose - oldmatch.hostlose + req.hostlose;
          let numguestwin = statguest.win - oldmatch.hostlose + req.hostlose;
          let numguestlose = statguest.lose - oldmatch.hostWin + req.hostWin;

          await this.teamStatModel.update({ id: stathost.id },{ win: numhostwin, lose: numhostlose });
          await this.teamStatModel.update({ id: statguest.id },{ win: numguestwin, lose: numguestlose });
        }
        // update and return the updated match 

        return match;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

}