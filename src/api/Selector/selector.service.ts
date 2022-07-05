import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import e from "express";
import { Chat } from "src/model/sql-entity/chat.entity";
import { LineUp } from "src/model/sql-entity/lineUp.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { RoomParticipant } from "src/model/sql-entity/participant.entity";
import { Room } from "src/model/sql-entity/room.entity";
import { Team } from "src/model/sql-entity/team.entity";
import { User } from "src/model/sql-entity/user.entity";
import { In, Repository } from "typeorm";


@Injectable()
export class SelectorService {
  constructor(
    @InjectRepository(Team) private teamModel: Repository<Team>,
    @InjectRepository(Room) private roomModel: Repository<Room>,
    @InjectRepository(RoomParticipant) private participantModel: Repository<RoomParticipant>,
    @InjectRepository(LineUp) private lineUpModel: Repository<LineUp>,
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

  async getChat(chatId: string){
    try{
        const chat = await this.chatModel.findOneByOrFail({ id: chatId });
        const message = await this.messageModel.findBy({ chatId: chatId })
        return {
          chat: chat,
          message: message
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