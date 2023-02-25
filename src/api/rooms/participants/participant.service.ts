import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateParticipantDto } from "src/model/dto/room/participant.dto";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class RoomParticipantService {
  constructor(
    @InjectRepository(RoomParticipant)
    private participantModel: Repository<RoomParticipant>
  ) {}

  // CRUD
  async create(req: CreateParticipantDto) {
    try {
      const participant = this.participantModel.create(req);

      return await this.participantModel.save(participant);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getParticipantByRoomId(roomId: string) {
    return this.participantModel.find({ where: { roomId } });
  }

  async countTeamGame(teamId: string, gameId: string) {
    try {
      const res = await this.participantModel.findAndCountBy({
        teamId,
        gameId
      });
      return res[1];
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(req: CreateParticipantDto) {
    try {
      const res = await this.participantModel.delete({
        teamId: req.teamId,
        roomId: req.roomId
      });
      if (res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }
      return;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
