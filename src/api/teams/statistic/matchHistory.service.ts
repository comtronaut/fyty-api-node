import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchDetail } from "src/model/sql-entity/team/statistic/matchDetail.entity";
import { MatchHistory } from "src/model/sql-entity/team/statistic/matchHistory.entity";
import { TeamStatistic } from "src/model/sql-entity/team/statistic/stat.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { Repository } from "typeorm";

@Injectable()
export class MatchHistortService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(TeamStatistic) private teamStatModel: Repository<TeamStatistic>,
    @InjectRepository(MatchHistory) private matchHistoryModel: Repository<MatchHistory>,
    @InjectRepository(MatchDetail) private matchDetailModel: Repository<MatchDetail>,
  ) { }

    // CRUD
  
    async getTeamStat(teamId: string){
        try {
          return await this.teamStatModel.findOneByOrFail({ id: teamId });
        } 
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async createStat(teamId: string){
        
    }

}