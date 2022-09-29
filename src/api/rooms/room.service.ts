import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { RoomStatus } from "src/common/_enum";
import { CreateRoomDto, UpdateRoomDto } from "src/model/dto/room/room.dto";
import { Appointment, AppointmentMember } from "src/model/sql-entity/appointment.entity";
import { Game } from "src/model/sql-entity/game.entity";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { RoomRequest } from "src/model/sql-entity/room/request.entity";
import { Room } from "src/model/sql-entity/room/room.entity";
import { Between, In, LessThanOrEqual, Repository } from "typeorm";
import { ChatService } from "../chats/chat.service";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomModel: Repository<Room>,
    @InjectRepository(RoomRequest) private roomRequestModel: Repository<RoomRequest>,
    @InjectRepository(RoomParticipant) private participantModel: Repository<RoomParticipant>,
    @InjectRepository(RoomLineupBoard) private roomLineUpBoardModel: Repository<RoomLineupBoard>,
    @InjectRepository(RoomLineup) private roomLineUpModel: Repository<RoomLineup>,
    @InjectRepository(Game) private gameModel: Repository<Game>,
    @InjectRepository(Appointment) private appointmentModel: Repository<Appointment>,
    @InjectRepository(AppointmentMember) private appointmentMemberModel: Repository<AppointmentMember>,
    private readonly chatService: ChatService,
  ) { }
  
  @Cron('* */30 * * * *')
  async handleCron() {
    try {
      var time = Date.now();
      let timestramp = new Date(time);
      // console.log(timestramp);
      timestramp = moment(timestramp).add(391, 'm').toDate();

      await this.roomModel.delete({endAt:LessThanOrEqual(timestramp)});
      // console.log(timestramp)
      return ;

      }catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // CRUD
  async create(req: CreateRoomDto) {
    try {
      const room = await this.roomModel.save(req);

      const board = await this.roomLineUpBoardModel.save({});
      
      const lineUps = req.teamlineUpIds.split(",");

      for(let i = 0; i < lineUps.length; i++){
          await this.roomLineUpModel.save({ roomLineUpBoardId: board.id, teamLineUpId: lineUps[i] });
      }

      const participantData = { roomId: room.id, teamId: req.hostId, gameId: req.gameId, roomLineUpBoardId: board.id };
      
      // generate chat and participant
      const res = this.participantModel.create(participantData);
      await this.participantModel.save(res);
      await this.chatService.create({ roomId: room.id });
      
      return {
        room: room
      };
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(roomId: string, req: UpdateRoomDto) {
    try {
      const updateRes = await this.roomModel.update(roomId, req);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return {
        room: await this.roomModel.findOneOrFail({ where: { id: roomId }})
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getJoinedRoom(teamId: string) {  // new
    try{
      const participants = await this.participantModel.findBy({ teamId: teamId });
      const joined = await this.roomModel.findBy({ id: In (participants.map(e => e.roomId ))});

      const request = await this.roomRequestModel.findBy({ teamId: teamId });
      const requested = await this.roomModel.findBy({ id: In (request.map(e => e.roomId)) });

      console.log(requested);

      return {
        joined: joined,
        requested: requested
      };
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
    
  }

  async getRoomsByGameId(gameId: string) {  // new
    try{
      return this.roomModel.findBy({ gameId: gameId });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
    
  }

  async getRoomsById(roomId: string) {  
    try{
      return await this.roomModel.findBy({ id: roomId });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
    
  }

  async getRoomByHostId(teamId: string) {  // hostId is also teamId
    try{
      return await this.roomModel.findBy({ hostId: teamId });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
    
  }

  async getRoomsByDate(date: string, gameId: string){ // date format is yyyy-mm-dd just like 2020-5-27 and we need output that at input day
    try{
      const today = new Date(date);
      let tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return await this.roomModel.findBy({ startAt: Between(today, tomorrow),  gameId: gameId});
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
  }

  async getAllRooms(gameId: string, roomName?: string, date?: any) { // new 

    try{
      if(roomName && date){
        const today = new Date(date);
        let tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return await this.roomModel.findBy({ name: roomName, startAt: Between(today, tomorrow), gameId: gameId });
      }
      if(roomName){
        return await this.roomModel.findBy({ name: roomName, gameId: gameId });
      }
      if(date){
        const today = new Date(date);
        let tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return await this.roomModel.findBy({ startAt: Between(today, tomorrow), gameId: gameId });
      }
      return await this.roomModel.findBy({ gameId: gameId });
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
  }

  async disband(payload: any) {
    try {
      const teamId = payload.teamId;
      const room = await this.roomModel.findOneByOrFail({ id: payload.roomId });

      if(room.hostId === teamId){

        // // remove appointment
        // await this.appointmentModel.delete({ roomId: room.id });
        
        const res = await this.roomModel.delete(room.id);
        if(res.affected !== 0) {

          return {
            roomId: room.id
          };
        }
        throw new Error("room is not deleted");
      }
      throw new Error("Only host can disband the room");
      
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async joinRoom(teamId: string, roomId: string) {
    try {
      const room = await this.roomModel.findOneByOrFail({ id: roomId });
      const game = await this.gameModel.findOneByOrFail({ id: room.gameId });

      // check is room available
      if(room.status === RoomStatus.UNAVAILABLE || room.status === RoomStatus.FULL) {
        throw new Error("room is not available");
      }

      // update room status
      await this.updateStatus(room);

      //find room request
      const request = await this.roomRequestModel.findOneByOrFail({ teamId: teamId, roomId: roomId });
      
      // add participant to the room
      const participantData = { roomId: room.id, teamId: teamId, gameId: game.id, roomLineUpBoardId: request.roomLineUpBoardId };
      const participant = await this.participantModel.save(participantData);

      // add appointment
      const appointmentData = { startAt: room.startAt, endAt: room.endAt, roomId: room.id, status: "WAITING", isDel: false };
      const appointment = await this.appointmentModel.save(appointmentData);

      await this.appointmentMemberModel.save({ teamId: teamId, appointId: appointment.id });  // for guest
      await this.appointmentMemberModel.save({ teamId: room.hostId, appointId: appointment.id }); // for host
      await this.roomRequestModel.delete({ id: request.id });

      return {
        roomParticipant: participant
      };
      
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateStatus(room: Room){
      room.status = RoomStatus.UNAVAILABLE;
      room.teamCount ++;
      await this.roomModel.update({ id: room.id }, room);
  }

  async leaveRoom(participantId: string) {
    try {
      
      const parti = await this.participantModel.findOneByOrFail({ id: participantId });
      const room = await this.roomModel.findOneByOrFail({ id: parti.roomId });

      // update participant count
      await this.roomModel.update({ id: room.id }, { teamCount: room.teamCount - 1 });

      // update room status
      room.status = RoomStatus.AVAILABLE;
      await this.roomModel.update({ id: room.id }, room);

      // remove appointment
      await this.appointmentModel.delete({ roomId: room.id });

      // remove participant from the room
      
      const res = await this.participantModel.delete({ id: participantId });
      console.log(res.affected + " participants has been delete");
      
      return {
        res: {
          roomParticipant: parti
        },
        roomId: room.id
      };

    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }
  
}


