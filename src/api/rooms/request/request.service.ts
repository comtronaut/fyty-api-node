import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoomRequestDto } from "src/model/dto/room/request.dto";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomRequest } from "src/model/sql-entity/room/request.entity";
import { Game } from "src/model/sql-entity/game.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomRequestService {
  constructor(
    @InjectRepository(RoomRequest) private roomRequestModel: Repository<RoomRequest>,
    @InjectRepository(RoomLineupBoard) private roomLineUpBoardModel: Repository<RoomLineupBoard>,
    @InjectRepository(RoomLineup) private roomLineUpModel: Repository<RoomLineup>,
    @InjectRepository(Game) private gameModel: Repository<Game>,
    @InjectRepository(Team) private teamModel: Repository<Team>,
  ) { }

  async create(roomId: string, body: CreateRoomRequestDto){
    try{
        
        if(await this.roomRequestModel.countBy({ roomId: roomId, teamId: body.teamId }) !==  0){
          throw new Error("Your team already send the request");
        }

        const board = await this.roomLineUpBoardModel.save({});

        if(body.teamlineUpIds !== undefined){
        
          const lineUps = body.teamlineUpIds.split(",");
        
        
          for(let i = 0; i < lineUps.length; i++){

            await this.roomLineUpModel.save({ teamLineUpId: lineUps[i], roomLineUpBoardId: board.id});

          }
        
        }else{
          
          const team = await this.teamModel.findOneByOrFail({ id: body.teamId });
          const game = await this.gameModel.findOneByOrFail({ id: team.gameId });

          for(let i = 0; i < game.lineupCap ; i++){
          
            await this.roomLineUpModel.save({ roomLineUpBoardId: board.id, teamLineUpId: null});

          }

        }

        const request = await this.roomRequestModel.
            save({  teamId: body.teamId, 
                    roomLineUpBoardId: board.id, 
                    roomId: roomId });

        return request;
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }
  
  async getRoomRequest(roomId: string){
    try{
        return await this.roomRequestModel.findBy({ roomId: roomId });
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async getRoomRequestByTeamId(teamId: string){
    try{
      return await this.roomRequestModel.findBy({ teamId: teamId });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
  }

  async delete(requestId: string, userId: string){
    try{
        const res = await this.roomRequestModel.delete({ id: requestId });
        if(res.affected === 1){
            return HttpStatus.NO_CONTENT;
        }
        else{
            return Error("can't delete request Id: " + { requestId });
        }
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async validateUser(Id: string, userId: string){ // just dummy
    try{
        return true;
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }
}
