import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomParticipant } from "src/model/sql-entity/participant.entity";
import { Room } from "src/model/sql-entity/room.entity";
import { Team } from "src/model/sql-entity/team.entity";
import { User } from "src/model/sql-entity/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class SelectorService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(Room) private roomModel: Repository<Room>,
    @InjectRepository(RoomParticipant) private participantModel: Repository<RoomParticipant>
  ) { }

  async getMe(me: User){
    try{
        const myTeam = await this.teamModel.findBy({ ownerId: me.id });
        return {
            user: me,
            userTeam: myTeam
        };
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async getRoom(roomId: string){        // not sure for map without await
    try{
        const room = await this.roomModel.findOneByOrFail({ id: roomId });
        const participants = await this.participantModel.findBy({ roomId: roomId })
        const teams = participants.map(e => this.teamModel.findOneByOrFail({ id: e.teamId })) // good? maybe not 

        return {
            room: room,
            roomParticipants: participants,
            teams: teams
        }
    }
    
    catch(err){
        throw new BadRequestException(err.message);
    }
  }



}