import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberRole } from "src/common/_enum";
import { CreateTeamDto } from "src/model/dto/team.dto";
import { Team } from "src/model/sql-entity/team.entity";
import { User } from "src/model/sql-entity/user.entity";
import { Repository } from "typeorm";
import { TeamMemberService } from "./members/team-member.service";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    private readonly memberService: TeamMemberService // Just think of the least imported components(both service and model)
  ) { }
  
  // CRUD
  async create(user: User, req: CreateTeamDto) {
    try {
      req.memberCount = 1;    // this can be default in entity file

      const team = await this.teamModel.save(req);
      // if it's possible, use enum. But makes it usable first if you don't sure
      // enum is in common file (can be seperated in further)
      const memberData = { teamId: team.id, userId: user.id, role: MemberRole.LEADER };   
      await this.memberService.create(memberData);

      return team;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamsByGameId(gameId: string) {
    return await this.teamModel.find({ where: { gameId }});
  }

  async getTeam(teamId: string) {
    return await this.teamModel.find({ where: { id: teamId }})
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
