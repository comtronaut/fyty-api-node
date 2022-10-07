import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTeamDto, UpdateTeamDto } from "src/model/dto/team.dto";
import { Team } from "src/model/sql-entity/team/team.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { In, Repository } from "typeorm";
import { TeamStatistic } from "src/model/sql-entity/team/statistic/stat.entity";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(TeamMember) private memberModel: Repository<TeamMember>,
    @InjectRepository(TeamStatistic) private statisticModel: Repository<TeamStatistic>,
  ) { }
  
  // CRUD
  async create(user: User, req: CreateTeamDto) { // for manager only version
    try {

      const teamCount = await this.memberModel.countBy({ userId: user.id });
      if(teamCount > 0)
        throw new Error("You already have team");

      req.ownerId = user.id; // set the team's owner
      const team = await this.teamModel.save(req);

      // create statistic
      await this.statisticModel.save({ id: team.id });

      // create member 
      await this.memberModel.save({ teamId: team.id, userId: user.id, role: "Manager" });
      return team;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeam(teamId: string) {
    try{
      
      return await this.teamModel.findOneByOrFail({ id: teamId });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
  }

  async getMyTeam(userId: string) {
    try{
      const members = await this.memberModel.findBy({ userId: userId });
      return await this.teamModel.findBy({ id: In (members.map (e => e.teamId)) });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
  }

  async getTeamsByGameId(gameId: string) {
    try{
      return await this.teamModel.findBy({ gameId: gameId });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
    
  }

  async getAllTeam() {
    return await this.teamModel.find();
  }

  async update(ownerId: string, req: UpdateTeamDto): Promise <Team> {
    try {
      const updateRes = await this.teamModel.update({ ownerId: ownerId }, req);

      if(updateRes.affected === 0) {
        throw new HttpException("", HttpStatus.NO_CONTENT);
      }
      return await this.teamModel.findOneByOrFail({ ownerId: ownerId });
    } 
    catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(userId: string, teamId: string) {
    try {
      const member = await this.memberModel.findOneByOrFail({ userId: userId, teamId: teamId });
      if(member.role === "Manager")
        await this.teamModel.delete(teamId);
      else{
        throw new Error("Only Manager can delete team");
      }

      return HttpStatus.OK;
    }
     catch (err) {
      throw new BadRequestException(err.message);
    }
  }

}
