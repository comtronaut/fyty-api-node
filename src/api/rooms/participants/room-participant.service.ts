import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateParticipantDto, CreateRoomDto, UpdateParticipantDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { RoomParticipant } from "src/model/sql-entity/participant.entity";
import { User } from "src/model/sql-entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomParticipantService {
  constructor(
    @InjectRepository(RoomParticipant) private participantModel: Repository<RoomParticipant>,
  ) { }
  
  // CRUD
  async create(req: CreateParticipantDto) {
    try {
      this.validation();
      return await this.participantModel.save(req);
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getParticipantByRoomId(roomId: string) {
    return this.participantModel.find({ where: { roomId }});
  }
  

  async validation() {
    
  }
//   async update(roomId: string, req: UpdateRoomDto) {
//     try {
//       const updateRes = await this.roomModel.update(roomId, req);

//       if(updateRes.affected === 0) {
//         return new HttpException("", HttpStatus.NO_CONTENT);
//       }

//       return await this.roomModel.findOneOrFail({ where: { id: roomId }});
//     } catch (err) {
//       throw new BadRequestException(err.message);
//     }
//   }

//   async getRoomsByGameId(gameId: string) {
//     return this.roomModel.find({ where: { gameId }});
//   }

//   // async updateUserRatingScore(userId: string) {

//   //   const [ user, reviews ] = await Promise.all([
//   //     this.userModel.findOneOrFail({ where: { id: userId }}),
//   //     this.reviewModel.find({ where: { revieweeId: userId }}),
//   //   ]);

//   //   const sumScore = reviews.reduce((acc, cur) => acc + cur.ratingScore, 0);
//   //   let ratingScore = sumScore / reviews.length;

//   //   // check upper and lower bound
//   //   if(ratingScore > 5) ratingScore = 5.00
//   //   else if(ratingScore < 0) ratingScore = 0.00
    
//   //   return this.userService.updateRatingScore(user, { ratingScore })
//   // }

  async delete(req: CreateParticipantDto) {
    try {
      const res = await this.participantModel.delete({ teamId: req.teamId, roomId: req.roomId });
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      return;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
