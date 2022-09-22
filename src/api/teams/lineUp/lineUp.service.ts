import { BadRequestException, HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Http2ServerResponse } from "http2";
import { CreateLineUpDto, UpdateLineUpDto } from "src/model/dto/lineUp.dto";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { TeamLineUp} from "src/model/sql-entity/team/lineUp.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class LineUpService {
  constructor(
    @InjectRepository(TeamLineUp) private lineUpModel: Repository<TeamLineUp>,
    @InjectRepository(TeamMember) private memberModel: Repository<TeamMember>,
    @InjectRepository(Team) private teamModel: Repository<Team>,

    @InjectRepository(RoomParticipant) private participantModel: Repository<RoomParticipant>,
    @InjectRepository(RoomLineup) private roomLineUpModel: Repository<RoomLineup>,
    @InjectRepository(RoomLineupBoard) private roomLineUpBoardModel: Repository<RoomLineupBoard>
  ) { }

  async create(req: CreateLineUpDto){
    try{
        return await this.lineUpModel.save(req);
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async update(user: User, lineUpId: string, req: UpdateLineUpDto){
      try{
        const teamMember = await this.memberModel.findOneOrFail({ where: { userId:user.id } });
        const team = await this.teamModel.findOneByOrFail({ id:teamMember.teamId});
        const lineup = await this.lineUpModel.findOneByOrFail({ id: lineUpId });

        if(teamMember.role == "Manager" && team.id == lineup.teamId){ // cheack if you are Manager
          await this.lineUpModel.update(lineUpId, req);
          return req;
        }
        else{
          throw new Error("Only team's Manager can edit lineUps");
        }
        
      }
      catch(err){
        throw new BadRequestException(err.message);
      }
      
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

  async getLineUpsByParti(participantId: string){
    try {      
      const parti = await this.participantModel.findOneByOrFail({ id: participantId });
      const lineUpBoard = await this.roomLineUpBoardModel.findOneByOrFail({ id: parti.roomLineUpBoardId });
      return await this.getLineUpsByBoard(lineUpBoard.id);
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineUpsByBoard(roomLineUpBoardId: string){
    try {      
      const roomLineUps = await this.roomLineUpModel.findBy({ roomLineUpBoardId: roomLineUpBoardId });
      return await this.lineUpModel.findBy({ id: In( roomLineUps.map( (e) => e.id) ) });
    }
    catch(err) {
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