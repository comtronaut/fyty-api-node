import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Http2ServerRequest } from "http2";
import { CreateGameHistoryDto, UpdateGameHistoryDto } from "src/model/dto/statistic.dto";
import { GameHistory } from "src/model/sql-entity/team/statistic/gameHistory.entity";
import { MatchDetail } from "src/model/sql-entity/team/statistic/matchDetail.entity";
import { MatchHistory } from "src/model/sql-entity/team/statistic/matchHistory.entity";
import { TeamStatistic } from "src/model/sql-entity/team/statistic/stat.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { Repository } from "typeorm";

@Injectable()
export class GameHistortService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(TeamStatistic) private teamStatModel: Repository<TeamStatistic>,
    @InjectRepository(MatchHistory) private matchHistoryModel: Repository<MatchHistory>,
    @InjectRepository(GameHistory) private gameHistoryModel: Repository<GameHistory>,
  ) { }
  
    async create(req: CreateGameHistoryDto){
        try {
          
          // save and return game history

        } 
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async getGameHistory(gameHistoryId: string){
      try {
        
        // findOne and return game history by Id
        return;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async getAllGameHistory(matchHistoryId: string){
      try {
        
        let games = [GameHistory]

        // find and return all game history by matchId

        return games;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async updateGameHistory(gameHistoryId: string, req: UpdateGameHistoryDto){
      try {
        
        let gameHistory = null;

        // update and return the game history 

        return gameHistory;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async deleteGameHistory(gameHistoryId: string){
      try {
        const res = await this.gameHistoryModel.delete(gameHistoryId);

        if(res.affected === 0) {
          return new HttpException("", HttpStatus.NO_CONTENT);
        }

        return HttpStatus.OK;

      } catch (err) {
        throw new BadRequestException(err.message);
      }
    }

}