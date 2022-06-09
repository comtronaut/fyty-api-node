import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoomDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { Room } from "src/model/sql-entity/room.entity";
import { User } from "src/model/sql-entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomModel: Repository<Room>,
  ) { }
  
  // CRUD
  async create(user: User, req: CreateRoomDto) {
    try {
      /*
        generate chat-id here 
      */
     
      req.hostId = user.id;

      const room = this.roomModel.save(req);
      
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
}
