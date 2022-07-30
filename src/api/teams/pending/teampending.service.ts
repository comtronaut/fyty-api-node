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
      return await this.teampendingModel.find({ where: { teamId,status:'pending' } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getteaminvitation(teamId: string) {
    try {
      return await this.teampendingModel.find({ where: { teamId,status:'invitation' } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async createpending(dto: CreateTeamPendingDto) {
    return await this.teampendingModel.save(dto);
  }

  async createinvitation(dto: CreateTeamPendingDto) {
    dto.status ='invitation';
    return await this.teampendingModel.save(dto);
  }

  async updatestatus(teampendingId: string, req: object) {
    try {
      const updateRes = await this.teampendingModel.update(teampendingId, req);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.teampendingModel.findOneOrFail({ where: { id: teampendingId }});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async discard(teampendingId: string) {
    try {
      const res = await this.teampendingModel.delete({id:teampendingId});
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      return;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
