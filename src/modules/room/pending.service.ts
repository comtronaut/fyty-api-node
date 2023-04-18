import { ConflictException, Injectable } from "@nestjs/common";
import { RoomPending } from "@prisma/client";
import { RoomPendingError } from "src/common/constants/errors";
import { CreateRoomPendingDto } from "src/model/dto/room-pending.dto";
import { NotifyService } from "src/modules/notification/lineNotify.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomPendingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: NotifyService
  ) {}

  async create(roomId: string, payload: CreateRoomPendingDto) {
    // check if already sent or joined
    const [ existedRoomPending, joinedRoom ] = await Promise.all([
      this.prisma.roomPending.findFirst({
        where: { roomId, teamId: payload.teamId }
      }),
      this.prisma.roomMember.findFirst({
        where: { roomId, teamId: payload.teamId }
      })
    ]);

    if (existedRoomPending) {
      throw new ConflictException(RoomPendingError.ExistedPending);
    }
    if (joinedRoom) {
      throw new ConflictException(RoomPendingError.ExistedRoomMembership);
    }

    const roomPending = await this.prisma.roomPending.create({
      data: {
        teamId: payload.teamId,
        roomId
      }
    });

    await this.prisma.roomPendingLineup.createMany({
      data: payload.teamLineupIds.map((teamLineupId) => ({
        roomPendingId: roomPending.id,
        teamLineupId,
        roomId
      }))
    });

    void this.lineNotify.searchUserForRequestNotify(roomId);

    return roomPending;
  }

  async getByRoomId(roomId: string): Promise<RoomPending[]> {
    return await this.prisma.roomPending.findMany({ where: { roomId } });
  }

  async deleteById(requestId: string, userId: string) {
    // TODO: validate if the pending request is owned by the user's team and the user is in management role

    await this.prisma.roomPending.delete({ where: { id: requestId } });
  }
}
