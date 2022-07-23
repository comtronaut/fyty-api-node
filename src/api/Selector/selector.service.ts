import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import e from "express";
import { Chat } from "src/model/sql-entity/chat.entity";
import { TeamLineUp } from "src/model/sql-entity/team/lineUp.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { Room } from "src/model/sql-entity/room/room.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { In, Repository } from "typeorm";


@Injectable()
export class SelectorService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(Room) private roomModel: Repository<Room>,
    @InjectRepository(RoomParticipant) private participantModel: Repository<RoomParticipant>,
    @InjectRepository(TeamLineUp) private lineUpModel: Repository<TeamLineUp>,
    @InjectRepository(Chat) private chatModel: Repository<Chat>,
    @InjectRepository(Message) private messageModel: Repository<Message>,
  ) { }

  async getMe(me: User){
    try{
        const myTeams = await this.teamModel.findBy({ ownerId: me.id });
        return {
          user: me,
          teams: myTeams
        };
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