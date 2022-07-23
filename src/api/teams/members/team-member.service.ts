import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "src/model/dto/team.dto";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Repository } from "typeorm";
import { User } from "src/model/sql-entity/user/user.entity";

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember) private memberModel: Repository<TeamMember>,
  ) { }

  async create( req: CreateTeamMemberDto) {
    try {
      req.role="Member";
      return await this.memberModel.save(req);
    }
    catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(teammemberId: string, req: UpdateTeamMemberDto) {
    try {
      const updateRes = await this.memberModel.update(teammemberId, req);

      if (updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.memberModel.findOneOrFail({ where: { id: teammemberId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getMemberByTeamId(teamId: string) {
    try {
      return await this.memberModel.find({ where: { teamId } });
    }
    catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async kickMember(teammemberId: string, user: User) {
    try {
      const member =  await this.memberModel.findOneOrFail({ where: { userId:user.id } });
      if (member.role == "Manager" || member.role == "Leader") {
        const res = await this.memberModel.delete({ id: teammemberId });
        if (res.affected === 0) {
          return new HttpException("", HttpStatus.NO_CONTENT)
        }
        console.log(res);
        return;
      }else{
        console.log("Can't kick member");
        return;
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async leaveTeam(teammemberId: string) {
    try {
      const res = await this.memberModel.delete({ id: teammemberId });
      if (res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      console.log(res);
      return;
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

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
  //     const res = await this.memberModel.delete(gameId);
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
