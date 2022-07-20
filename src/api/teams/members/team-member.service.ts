import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember) private memberModel: Repository<TeamMember>,
  ) { }
  
  async create(req: object) {
    try {
      return await this.memberModel.save(req);
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  // async update(teamId: string, req: object) {
  //   try {
  //     const updateRes = await this.memberModel.update(teamId, req);

  //     if(updateRes.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT);
  //     }

  //     return await this.memberModel.findOneOrFail({ where: { id: teamId }});
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  async getMemberByTeamId(teamId: string) {
    try {
      return await this.memberModel.find({ where: { teamId }});
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  // async kickMember(req: Record<string, any>) {
  //   try {
  //     const res = await this.memberModel.delete({ teamId: req.teamId, userId: req.userId });
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async leaveTeam() {
  //   try {
      
  //   } catch(err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async promoteOrDemoteMember(req: Record<string, any>) {
  //   try {
      
  //   } catch(err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

//   async getTeamsByGameId(gameId: string) {
//     return await this.teamModel.find({ where: { gameId }});
//   }

  

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
