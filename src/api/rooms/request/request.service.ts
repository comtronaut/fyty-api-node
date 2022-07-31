import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoomRequestDto } from "src/model/dto/room/request.dto";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomRequest } from "src/model/sql-entity/room/request.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomRequestService {
  constructor(
    @InjectRepository(RoomRequest) private roomRequestModel: Repository<RoomRequest>,
    @InjectRepository(RoomLineupBoard) private roomLineUpBoardModel: Repository<RoomLineupBoard>,
    @InjectRepository(RoomLineup) private roomLineUpModel: Repository<RoomLineup>
  ) { }

  async create(roomId: string, body: CreateRoomRequestDto){
    try{
        const board = await this.roomLineUpBoardModel.save({});
        for(let i in body.teamlineUpIds){
            const lineUp = this.roomLineUpModel.create({ teamLineUpId: i, roomLineUpBoardId: board.id});
            await this.roomLineUpModel.save(lineUp);
        }

        const request = this.roomRequestModel.
        create({ teamId: body.teamId, 
                 roomLineUpBoardId: board.id, 
                 roomId: roomId });

        await this.roomRequestModel.save(request);
        return request;
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }
  
  async getRoomRequest(roomId: string){
    try{
        return this.roomRequestModel.findBy({ roomId: roomId });
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async delete(requestId: string, userId: string){
    try{
        if(await this.validateUser(requestId, userId)){
            const res = await this.roomRequestModel.delete({ id: requestId });
            if(res.affected === 1){
                return HttpStatus.NO_CONTENT;
            }
            else{
                return Error("can't delete request Id: " + { requestId });
            }
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
