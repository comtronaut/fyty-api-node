import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTeamDto, UpdateTeamDto } from "src/model/dto/team.dto";
import { Team } from "src/model/sql-entity/team/team.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { In, Repository } from "typeorm";
import e from "express";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(TeamMember) private memberModel: Repository<TeamMember>,
  ) { }
  
  // CRUD
  async create(user: User, req: CreateTeamDto) { // for manager only version
    try {
      req.ownerId = user.id; // set the team's owner
      const team = await this.teamModel.save(req);
      const member = await this.memberModel.save({ teamId: team.id, userId: user.id, role: "Manager" });
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

  async delete(ownerID: string, teamId: string) {
    try {
      const targetedTeam = await this.teamModel.findOneByOrFail({ id: teamId });
      if(targetedTeam.ownerId === ownerID)
      await this.teamModel.delete(teamId);

      return new HttpException("", HttpStatus.NO_CONTENT);
    }
     catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  // async clear(){
    
  //   await this.teamModel.clear();
  //   return "PK";
  // }
}
