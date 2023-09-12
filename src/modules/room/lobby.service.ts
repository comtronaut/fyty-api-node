import { Injectable } from "@nestjs/common";
import { Room, User } from "@prisma/client";

import { getDayRangeWithin } from "common/utils/date";
import { LobbyForUserResponseDto } from "model/dto/room.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class LobbyService {
  constructor(private readonly prisma: PrismaService) {}

  async getLobby(gameId: string, date: string): Promise<Room[]> {
    const { start, end } = getDayRangeWithin(date, 7);

    return await this.prisma.room.findMany({
      where: {
        gameId,
        appointment: {
          startAt: { gte: start, lte: end }
        }
      },
      include: {
        appointment: true,
        members: true
      }
    });
  }

  async getLobbyForUser(
    gameId: string,
    date: string,
    user: User
  ): Promise<LobbyForUserResponseDto> {
    const { start, end } = getDayRangeWithin(date, 7);

    const userGameTeams = await this.prisma.team.findMany({
      where: {
        gameId,
        members: {
          some: { userId: user.id }
        }
      }
    });

    if (!userGameTeams.length) {
      return {
        userGameTeams: [],
        hostedRoomIds: [],
        joinedRoomIds: [],
        requestingPendings: [],
        hostingPendings: []
      };
    }

    const userGameTeamIds = userGameTeams.map<string>((e) => e.id);

    const [ joinedRooms, requestingPendings, hostingPendings ] = await Promise.all([
      this.prisma.room.findMany({
        where: {
          appointment: {
            eventRoundId: null,
            startAt: { gte: start, lte: end }
          },
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
      this.prisma.roomPending.findMany({
        where: {
          teamId: { in: userGameTeamIds },
          status: "INCOMING",
          room: {
            appointment: {
              eventRoundId: null,
              startAt: { gte: start, lte: end }
            }
          }
        }
      }),
      this.prisma.roomPending.findMany({
        where: {
          status: "INCOMING",
          room: {
            hostTeamId: { in: userGameTeamIds },
            appointment: {
              eventRoundId: null,
              startAt: { gte: start, lte: end }
            }
          }
        }
      })
    ]);

    const hostedRoomIds = joinedRooms.flatMap((e) =>
      userGameTeamIds.includes(e.hostTeamId) ? [ e.id ] : []
    );
    const joinedRoomIds = joinedRooms.map((e) => e.id);

    return {
      userGameTeams,
      hostedRoomIds,
      joinedRoomIds,
      requestingPendings,
      hostingPendings
    };
  }
}
