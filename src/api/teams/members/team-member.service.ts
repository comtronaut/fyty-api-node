import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CreateTeamMemberDto,
  UpdateTeamMemberDto
} from "src/model/dto/team.dto";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Repository } from "typeorm";
import { User } from "src/model/sql-entity/user/user.entity";
import { Team } from "src/model/sql-entity/team/team.entity";

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember) private memberModel: Repository<TeamMember>,
    @InjectRepository(Team) private teamModel: Repository<Team>
  ) {}

  async create(req: CreateTeamMemberDto) {
    try {
      const memberCount = await this.memberModel.countBy({
        userId: req.userId
      });
      if (memberCount > 0) {
        throw new Error("This user already joined team");
      }
      req.role = "Member";

      return await this.memberModel.save(req);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(teammemberId: string, req: UpdateTeamMemberDto) {
    try {
      const updateRes = await this.memberModel.update(teammemberId, req);

      if (updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.memberModel.findOneOrFail({
        where: { id: teammemberId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getMemberByTeamId(teamId: string) {
    try {
      return await this.memberModel.find({ where: { teamId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async kickMember(teammemberId: string, user: User) {
    try {
      const member = await this.memberModel.findOneOrFail({
        where: { userId: user.id }
      });
      if (member.role === "Manager" || member.role === "Leader") {
        const res = await this.memberModel.delete({ id: teammemberId });
        if (res.affected === 0) {
          return new HttpException("", HttpStatus.NO_CONTENT);
        }
        return HttpStatus.OK;
      } else {
        throw new Error("Permission denined");
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async leaveTeam(teamMemberId: string) {
    try {
      const teamMember = await this.memberModel.findOneOrFail({
        where: { id: teamMemberId }
      });
      const countManager = await this.memberModel.findAndCount({
        where: { role: "Manager", teamId: teamMember.teamId }
      });
      await this.memberModel.delete({ id: teamMemberId });

      const countMember = await this.memberModel.countBy({
        teamId: teamMember.teamId
      });

      if (countMember == 0) {
        await this.teamModel.delete({ id: teamMember.teamId });
        return HttpStatus.NO_CONTENT;
      }

      if (teamMember.role == "Manager" && countManager[1] == 1) {
        await this.teamModel.delete({ id: teamMember.teamId });
      }

      return HttpStatus.OK;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
