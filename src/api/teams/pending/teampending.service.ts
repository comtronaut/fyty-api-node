import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTeamPendingDto,UpdateTeamPendingDto } from "src/model/dto/team.dto";
import { TeamPending } from "src/model/sql-entity/team/pending.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeampendingService{
  constructor(
    @InjectRepository(TeamPending) private teampendingModel: Repository<TeamPending>,
  ) { }

  async getTeamPendingByUser(userId: string) {
    try {
      return await this.teampendingModel.find({ where: { userId,status:'pending' } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamInvitationByUser(userId: string) {
    try {
      return await this.teampendingModel.find({ where: { userId,status:'invitation' } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamPending(teamId: string) {
    try {
      return await this.teampendingModel.find({ where: { teamId,status:'pending' } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamInvitation(teamId: string) {
    try {
      return await this.teampendingModel.find({ where: { teamId,status:'invitation' } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async createTeamPending(req: CreateTeamPendingDto) {
    return await this.teampendingModel.save(req);
  }

  async createTeamInvitation(req: CreateTeamPendingDto) {
    req.status = 'invitation';
    return await this.teampendingModel.save(req);
  }

  async updateStatus(teampendingId: string, req: UpdateTeamPendingDto) {
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

  async discard(teamPendingId: string) {
    try {
      const res = await this.teampendingModel.delete({id: teamPendingId});
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      return HttpStatus.OK;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
