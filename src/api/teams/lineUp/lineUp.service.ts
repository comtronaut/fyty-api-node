import { BadRequestException, HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Http2ServerResponse } from "http2";
import { CreateLineUpDto, UpdateLineUpDto } from "src/model/dto/lineUp.dto";
import { LineUp } from "src/model/sql-entity/lineUp.entity";
import { Team } from "src/model/sql-entity/team.entity";
import { User } from "src/model/sql-entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class LineUpService {
  constructor(
    @InjectRepository(LineUp) private lineUpModel: Repository<LineUp>,
    @InjectRepository(Team) private teamModel: Repository<Team>
  ) { }

  async create(req: CreateLineUpDto){
    try{
        return await this.lineUpModel.save(req);
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async update(lineUpId: string ,req: UpdateLineUpDto){
    
      await this.lineUpModel.update(lineUpId, req);
      return await this.lineUpModel.findOneByOrFail({ id: lineUpId })
  }

  async getLineUps(teamId?: string){
    try{
        if(teamId){
            return this.lineUpModel.findBy({ teamId: teamId });
        }
        return this.lineUpModel.find();    
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
    
  }

  async getLineUpById(lineUpId: string){
    try{
        return this.lineUpModel.findOneByOrFail({ id: lineUpId });
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
    
  }

  async deleteAllLineUps(ownerId: string, teamId: string){
    try{
        const targetedTeam = await this.teamModel.findOneByOrFail({ id: teamId });
        if(targetedTeam.ownerId === ownerId){
            await this.lineUpModel.delete({ teamId: teamId });
            return HttpStatus.NO_CONTENT;
        }

    }
    catch(err){
        throw new BadRequestException(err.message);
    }
    
  }

  async deleteLineById(ownerId: string, lineUpId: string){
    try{
        const targetedLineUp = await this.lineUpModel.findOneByOrFail({ id: lineUpId });
        const team = await this.teamModel.findOneByOrFail({ id: targetedLineUp.teamId })
        
        if(team.ownerId === ownerId){
            await this.lineUpModel.delete({ id: lineUpId });
            return HttpStatus.NO_CONTENT;
        }
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
    
  }

  


}