import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { getDayRangeWithin } from "common/utils/date";
import { LobbyDetailResponseDto } from "model/dto/room.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class LobbyService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async getLobbyByGameId(
    gameId: string,
    date: string,
    user: User
  ): Promise<LobbyDetailResponseDto> {
    const { start, end } = getDayRangeWithin(date, 7);

    const [ rooms, userGameTeams ] = await Promise.all([
      this.prisma.room.findMany({
        where: { gameId, startAt: { gte: start, lte: end } },
        include: { appointment: true }
      }),
      this.prisma.team.findMany({
        where: {
          gameId,
          members: {
            some: { userId: user.id }
          }
        }
      })
    ]);

    if (!userGameTeams.length) {
      return {
        rooms,
        userGameTeams: [],
        hostedRoomIds: [],
        joinedRoomIds: [],
        pendingRoomIds: [],
        roomPendings: []
      };
    }

    const userGameTeamIds = userGameTeams.map<string>((e) => e.id);

    const [ joinedRooms, pendingRooms, roomPendings ] = await Promise.all([
      this.prisma.room.findMany({
        where: {
          members: {
            some: {
              teamId: { in: userGameTeamIds }
            }
          }
        },
        select: {
          id: true,
          hostTeamId: true
        }
      }),
      this.prisma.room.findMany({
        where: {
          pendings: {
            some: {
              teamId: { in: userGameTeamIds },
              status: "INCOMING"
            }
          }
        },
        select: { id: true }
      }),
      this.prisma.roomPending.findMany({
        where: {
          teamId: { in: userGameTeamIds }
        }
      })
    ]);

    const hostedRoomIds = joinedRooms
      .filter((e) => userGameTeamIds.includes(e.hostTeamId))
      .map((e) => e.id);
    const joinedRoomIds = joinedRooms.map((e) => e.id);
    const pendingRoomIds = pendingRooms.map((e) => e.id);

    return {
      rooms,
      userGameTeams,
      hostedRoomIds,
      joinedRoomIds,
      pendingRoomIds,
      roomPendings
    };
  }
}
