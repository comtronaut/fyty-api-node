import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateGameDto, UpdateGameDto } from "src/model/dto/game.dto";
import { Game } from "src/model/sql-entity/game.entity";
import { Repository } from "typeorm";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameModel: Repository<Game>,
  ) { }
  
  // CRUD
  async create(req: CreateGameDto) {
    try {
      return await this.gameModel.save(req);
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllGames() {
    return await this.gameModel.find();
  }

  async update(gameId: string, req: object) {
    try {
      const updateRes = await this.gameModel.update(gameId, req);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.gameModel.findOneOrFail({ where: { id: gameId }});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(gameId: string) {
    try {
      const res = await this.gameModel.delete(gameId);
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      return;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
