import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TeamStatistic } from "src/model/sql-entity/team/statistic/stat.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeamStatisticService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(TeamStatistic) private teamStatModel: Repository<TeamStatistic>,
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