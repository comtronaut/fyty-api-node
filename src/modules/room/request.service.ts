import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomPendingDto } from "src/model/dto/room-pending.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { NotifyService } from "src/modules/notification/lineNotify.service";

@Injectable()
export class RoomRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: NotifyService
  ) {}

  async create(roomId: string, body: CreateRoomPendingDto) {
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

      void this.lineNotify.searchUserForRequestNotify(roomId);

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
