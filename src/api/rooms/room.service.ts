import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { identity } from "rxjs";
import { RoomStatus } from "src/common/_enum";
import { CreateParticipantDto, CreateRoomDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { Game } from "src/model/sql-entity/game.entity";
import { Room } from "src/model/sql-entity/room.entity";
import { Repository } from "typeorm";
import { ChatService } from "../chats/chat.service";
import { TeamService } from "../teams/team.service";
import { RoomParticipantService } from "./participants/room-participant.service";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomModel: Repository<Room>,
    @InjectRepository(Game) private gameModel: Repository<Game>,
    private readonly participantService: RoomParticipantService,
    private readonly chatService: ChatService,
    private readonly teamService: TeamService
  ) { }
  
  // CRUD
  async create(req: CreateRoomDto) {
    try {
      const room = this.roomModel.create(req);
      await this.roomModel.save(req);

      const participantData = { roomId: room.id, teamId: room.hostId, gameId: req.gameId };

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

  async disband(payload: any) {
    try {
      const teamId = payload.teamId;
      const room = await this.roomModel.findOneByOrFail({ id: payload.roomId });

      if(room.hostId === teamId){
        const res = await this.roomModel.delete(room.id);
        if(res.affected === 0) {
          return room.id
        }
        throw new Error("room is not deleted");
      }
      throw new Error("Only host can disband the room");
      
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async joinRoom(payload: any) {
    try {
      const teamId = payload.teamId;
      const roomId = payload.roomId;

      const room = await this.roomModel.findOneByOrFail({ id: roomId });
      const game = await this.gameModel.findOneByOrFail({ id: room.gameId });

      const count = await this.participantService.countTeamGame(teamId, room.gameId);

      // check is room available
      if(room.status === RoomStatus.UNAVAILABLE || room.status === RoomStatus.FULL) {
        throw new Error("room is not available");
      }

      // 1 team / room / game validation
      if(count > 0){
        throw new Error("Your team has already joined some where");
      }      

      // update participant count
      await this.update(room.id, { teamCount: room.teamCount + 1 });

      // update room status
      this.updateStatus(game, room);
      
      
      // add participant to the room
      const participantData = { roomId: room.id, teamId: teamId, gameId: room.gameId };
      await this.participantService.create(participantData);
      
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateStatus(game: Game, room: Room){
    const del = game.teamCap - room.teamCount;
    if(del == 1){ // available
      room.status = RoomStatus.UNAVAILABLE; 
      await this.roomModel.update({ id: room.id }, room);
    }

  }

  async leaveRoom(req: CreateParticipantDto) {
    try {
      const room = await this.roomModel.findOneOrFail({ where: { id: req.roomId }});

      // update participant count
      await this.update(room.id, { teamCount: room.teamCount - 1 });

      // update room status
      room.status = RoomStatus.AVAILABLE;
      await this.roomModel.update({ id: room.id }, room);

      const parti = await this.participantService.delete(req);
      
      // remove participant from the room
      return parti;
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }
}
