import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTeamPendingDto } from "src/model/dto/team.dto";
import { TeamPending } from "src/model/sql-entity/team/pending.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeampendingService{
  constructor(
    @InjectRepository(TeamPending) private teampendingModel: Repository<TeamPending>,
  ) { }

  async getteampending(teamId: string) {
    try {
      return await this.teampendingModel.find({ where: { teamId } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(dto: CreateTeamPendingDto) {
    return await this.teampendingModel.save(dto);
  }

  // async update(gameId: string, req: object) {
  //   try {
  //     const updateRes = await this.gameModel.update(gameId, req);

  //     if(updateRes.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT);
  //     }

  //     return await this.gameModel.findOneOrFail({ where: { id: gameId }});
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async delete(gameId: string) {
  //   try {
  //     const res = await this.gameModel.delete(gameId);
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
