import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomStatus } from "src/common/_enum";
import { CreateRoomDto, UpdateRoomDto } from "src/model/dto/room/room.dto";
import { Appointment, AppointmentMember } from "src/model/sql-entity/appointment.entity";
import { Game } from "src/model/sql-entity/game.entity";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { RoomRequest } from "src/model/sql-entity/room/request.entity";
import { Room } from "src/model/sql-entity/room/room.entity";
import { Between, In, MoreThan, Repository } from "typeorm";
import { ChatService } from "../chats/chat.service";
import { RoomParticipantService } from "./participants/participant.service";


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

    private readonly participantService: RoomParticipantService,
    private readonly chatService: ChatService,
  ) { }
  
  // CRUD
  async create(req: CreateRoomDto) {
    try {
      const room = await this.roomModel.save(req);

      const board = await this.roomLineUpBoardModel.save({});
        for(let i in req.teamlineUpIds){
            const lineUp = this.roomLineUpModel.create({ teamLineUpId: i, roomLineUpBoardId: board.id});
            await this.roomLineUpModel.save(lineUp);
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

  async getJoidedRoom(teamId: string) {  // new
    try{
      const participants = await this.participantModel.findBy({ teamId: teamId });
      const rooms = await this.roomModel.findBy({ id: In (participants.map(e => e.roomId ))});

      return rooms;
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
      return this.roomModel.findBy({ id: roomId });
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
        return await this.roomModel.findBy({ name: roomName, startAt: date, gameId: gameId });
      }
      if(roomName){
        return await this.roomModel.findBy({ name: roomName, gameId: gameId });
      }
      if(date){
        return await this.roomModel.findBy({ startAt: date, gameId: gameId });
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

      if(room.hostId == teamId){
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

      //const count = await this.participantService.countTeamGame(teamId, room.gameId);

      // check is room available
      if(room.status === RoomStatus.UNAVAILABLE || room.status === RoomStatus.FULL) {
        throw new Error("room is not available");
      }

      // 1 team / room / game validation
      // if(count > 0){
      //   throw new Error("Your team has already joined some where");
      // }      

      // update team count
      await this.roomModel.update({ id: roomId }, { teamCount: room.teamCount + 1 });

      // update room status
      // await this.updateStatus(game, room);

      //find room request
      const request = await this.roomRequestModel.findOneByOrFail({ teamId: teamId, roomId: roomId });
      
      // add participant to the room
      const participantData = { roomId: room.id, teamId: teamId, gameId: game.id, roomLineUpBoardId: request.roomLineUpBoardId };
      const participant = await this.participantModel.save(participantData);

      // add appointment
      const appointmentData = { startAt: room.startAt, endAt: room.endAt, roomId: room.id, status: "WAITING", isDel: false };
      const appointment = await this.appointmentModel.save(appointmentData);
      await this.appointmentMemberModel.save({ teamId: teamId, appointId: appointment.id });
      await this.roomRequestModel.delete({ id: request.id });

      return {
        roomParticipant: participant
      };
      
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateStatus(game: Game, room: Room){
    const del = game.teamCap - room.teamCount;
    if(del === 1){ // available
      room.status = RoomStatus.UNAVAILABLE; 
      await this.roomModel.update({ id: room.id }, room);
    }
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
