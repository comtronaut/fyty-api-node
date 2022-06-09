import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTeamDto } from "src/model/dto/team.dto";
import { Team } from "src/model/sql-entity/team.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
  ) { }
  
  // CRUD
  async create(req: CreateTeamDto) {
    try {
      req.memberCount = 1;
      
      return await this.teamModel.save(req);
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamsByGameId(gameId: string) {
    return await this.teamModel.find({ where: { gameId }});
  }

  async update(gameId: string, req: object) {
    try {
      const updateRes = await this.teamModel.update(gameId, req);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.teamModel.findOneOrFail({ where: { id: gameId }});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // async delete(gameId: string) {
  //   try {
  //     const res = await this.teamModel.delete(gameId);
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
