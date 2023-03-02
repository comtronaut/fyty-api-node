import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomRequestDto } from "src/model/dto/room/request.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class RoomRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(roomId: string, body: CreateRoomRequestDto) {
    try {
      const roomRequestCount = await this.prisma.roomRequest.count({
        where: { roomId, teamId: body.teamId }
      });
      if (roomRequestCount !== 0) {
        throw new Error("Your team already send the request");
      }

      const board = await this.prisma.roomLineupBoard.create({ data: {} });

      const lineupIds = body.teamlineUpIds.split(",");
      await this.prisma.roomLineup.createMany({
        data: lineupIds.map((lineup) => ({
          teamLineUpId: lineup,
          roomLineUpBoardId: board.id
        }))
      });

      const request = await this.prisma.roomRequest.create({
        data: {
          teamId: body.teamId,
          roomLineUpBoardId: board.id,
          roomId
        }
      });

      return request;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomRequest(roomId: string) {
    try {
      return await this.prisma.roomRequest.findMany({ where: { roomId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomRequestByTeamId(teamId: string) {
    try {
      return await this.prisma.roomRequest.findMany({ where: { teamId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(requestId: string, userId: string) {
    try {
      await this.prisma.roomRequest.delete({ where: { id: requestId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
