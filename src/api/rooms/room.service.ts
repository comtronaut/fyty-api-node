import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomStatus } from "src/common/_enum";
import { CreateParticipantDto, CreateRoomDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { Room } from "src/model/sql-entity/room.entity";
import { Repository } from "typeorm";
import { ChatService } from "../chats/chat.service";
import { RoomParticipantService } from "./participants/room-participant.service";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomModel: Repository<Room>,
    private readonly participantService: RoomParticipantService,
    private readonly chatService: ChatService
  ) { }
  
  // CRUD
  async create(req: CreateRoomDto) {
    try {
      const room = await this.roomModel.save(req);

      const participantData = { roomId: room.id, teamId: req.teamId };

      // generate chat and participant
      await Promise.all([
        this.chatService.create({ roomId: room.id }),
        this.participantService.create(participantData)
      ]);
      
      return room;
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

      return await this.roomModel.findOneOrFail({ where: { id: roomId }});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomsByGameId(gameId: string) {
    return this.roomModel.find({ where: { gameId }});
  }

  async getAllRooms() {
    try{
      return await this.roomModel.find();
    }
    catch(err){
      throw new BadRequestException(err.message);
    }
  }

  async disband(payload: any){
    return "blai";
  }

  // async updateUserRatingScore(userId: string) {

  //   const [ user, reviews ] = await Promise.all([
  //     this.userModel.findOneOrFail({ where: { id: userId }}),
  //     this.reviewModel.find({ where: { revieweeId: userId }}),
  //   ]);

  //   const sumScore = reviews.reduce((acc, cur) => acc + cur.ratingScore, 0);
  //   let ratingScore = sumScore / reviews.length;

  //   // check upper and lower bound
  //   if(ratingScore > 5) ratingScore = 5.00
  //   else if(ratingScore < 0) ratingScore = 0.00
    
  //   return this.userService.updateRatingScore(user, { ratingScore })
  // }

  async delete(roomId: string) {
    try {
      const res = await this.roomModel.delete(roomId);
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      return;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async joinRoom(teamId: string) {
    try {
      const room = await this.roomModel.findOneByOrFail({ id: teamId });

      // check is room available
      if(room.status === RoomStatus.UNAVAILABLE || room.status === RoomStatus.FULL) {
        throw new Error("room is not available");
      }

      // 1 team / room / game validation

      // update participant count
      await this.update(room.id, { teamCount: room.teamCount + 1 });

      // update room status
      
      // add participant to the room
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async leaveRoom(req: CreateParticipantDto) {
    try {
      const room = await this.roomModel.findOneOrFail({ where: { id: req.roomId }});

      // update participant count
      await this.update(room.id, { teamCount: room.teamCount - 1 });

      // update room status
      
      // remove participant from the room
      return await this.participantService.delete(req);
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }
}
