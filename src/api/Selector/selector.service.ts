import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { TeamLineUp } from "src/model/sql-entity/team/lineUp.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { Room } from "src/model/sql-entity/room/room.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { In, Repository } from "typeorm";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";


@Injectable()
export class SelectorService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(TeamMember) private teamMemberModel: Repository<TeamMember>,
    @InjectRepository(Room) private roomModel: Repository<Room>,
    @InjectRepository(RoomParticipant) private participantModel: Repository<RoomParticipant>,
    @InjectRepository(TeamLineUp) private lineUpModel: Repository<TeamLineUp>,
    @InjectRepository(Chat) private chatModel: Repository<Chat>,
    @InjectRepository(Message) private messageModel: Repository<Message>,
  ) { }

  async getMe(me: User){
    try{
        const member = await this.teamMemberModel.findOneByOrFail({ userId: me.id });
        const myTeams = await this.teamModel.findBy({ id: member.teamId });
        return {
          user: me,
          teams: myTeams
        };
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async getAppointment(me: User){
    try{
        const myTeams = await this.teamMemberModel.findBy({ userId: me.id });
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async getChat(roomId: string){
    try{
        const chat = await this.chatModel.findOneByOrFail({ roomId: roomId });
        const message = await this.messageModel.findBy({ chatId: chat.id })
        return {
          chat: chat,
          messages: message
        };
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }


  async getRoom(roomId: string){        // not sure for map without await
    try{
        const room = await this.roomModel.findOneByOrFail({ id: roomId });
        const participants = await this.participantModel.findBy({ roomId: roomId });

        const teams = await this.teamModel.findBy({ id: In (participants.map(e => e.teamId ))})

        // const teams = participants.map(e => this.teamModel.findOneByOrFail({ id: e.teamId })) // good? maybe not 
        // console.log(teams);

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

  async getTeam(teamId: string){
    try{
      const team = await this.teamModel.findOneByOrFail({ id: teamId });
      const lineUps = await this.lineUpModel.findBy({ teamId: teamId });

      return{
        team: team,
        teamLineup: lineUps
      };
      
    }
  
  catch(err){
      throw new BadRequestException(err.message);
  }
  }



}