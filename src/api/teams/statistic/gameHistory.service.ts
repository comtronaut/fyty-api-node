import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateGameHistoryDto, UpdateGameHistoryDto, Uploader } from "src/model/dto/statistic.dto";
import { GameHistory } from "src/model/sql-entity/team/statistic/gameHistory.entity";
import { MatchHistory } from "src/model/sql-entity/team/statistic/matchHistory.entity";
import { IsNull, Repository } from "typeorm";

@Injectable()
export class GameHistortService {
  constructor(
    @InjectRepository(MatchHistory) private matchHistoryModel: Repository<MatchHistory>,
    @InjectRepository(GameHistory) private gameHistoryModel: Repository<GameHistory>,
  ) { }
  
    async create(req: CreateGameHistoryDto){
        try {
          
          return await this.gameHistoryModel.save(req);
        } 
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    async getGameHistory(gameHistoryId: string){
      try {
        return await this.gameHistoryModel.findOneByOrFail({ id: gameHistoryId }) ;
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async getAllGameHistory(matchHistoryId: string){
      try {
        
        return await this.gameHistoryModel.findBy({ matchHistoryId: matchHistoryId });
      } 
      catch(err) {
          throw new BadRequestException(err.message);
      }
    }

    async updateGameHistory(gameHistoryId: string, req: UpdateGameHistoryDto){
      try {

        const hosted = await this.matchHistoryModel.findOneBy({ hostId: req.teamId });

        if(hosted !== null) {
          if(hosted.uploader !== Uploader.GUEST){

            if(hosted.uploader === Uploader.NONE) // edit Uploader
              await this.matchHistoryModel.update({ id: hosted.id }, { uploader: Uploader.HOST })
            
            return await this.gameHistoryModel.update({ id: gameHistoryId }, req)
          }
          else{
            throw new Error("Only the team who uploaded can edit");
          }
        }

        const guested = await this.matchHistoryModel.findOneBy({ guestId: req.teamId });

        if(guested !== null) {
          if(guested.uploader !== Uploader.HOST){

            if(guested.uploader === Uploader.NONE) // edit Uploader
              await this.matchHistoryModel.update({ id: guested.id }, { uploader: Uploader.GUEST })
            
            return await this.gameHistoryModel.update({ id: gameHistoryId }, req)
          }
          else{
            throw new Error("Only the team who uploaded can edit");
          }
        }

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