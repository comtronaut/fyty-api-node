import { Injectable } from "@nestjs/common";
import { Room, RoomPending, Team, User } from "@prisma/client";
import { getDayRangeWithin } from "src/common/utils/date";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomService } from "./room.service";

@Injectable()
export class LobbyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomService: RoomService
  ) {}

  async getLobbyByGameId(gameId: string, date: any, user: User): Promise<{
    rooms: Room[];
    userGameTeams: Team[],
    hostedRoomIds: string[],
    joinedRoomIds: string[],
    pendingRoomIds: string[],
    roomPendings: RoomPending[]
  }> {
    const { start, end } = getDayRangeWithin(date);

    const [ rooms, memberRes ] = await Promise.all([
      this.prisma.room.findMany({
        where: { gameId, startAt: { gte: start, lte: end } }
      }),
      this.prisma.teamMember.findMany({
        where: { userId: user.id, team: { gameId } },
        select: { team: true }
      })
    ]);

    if (!memberRes.length) {
      return {
        rooms,
        userGameTeams: [],
        hostedRoomIds: [],
        joinedRoomIds: [],
        pendingRoomIds: [],
        roomPendings: []
      };
    }

    const userGameTeams = memberRes.map((e) => e.team);
    const userGameTeamIds = userGameTeams.map((e) => e.id);

    const [ res, roomPendings ] = await Promise.all([
      Promise.all(
        userGameTeams.map((team) => this.roomService.getByTeamFilter(team.id, { isJoined: true, isPending: true, isHosted: true }))
      ),
      this.prisma.roomPending.findMany({
        where: { teamId: { in: userGameTeamIds } }
      })
    ]);

    const hostedRoomIds = res.flatMap((e) => e.hosted ?? []).map((e) => e.id);
    const joinedRoomIds = res.flatMap((e) => e.joined ?? []).map((e) => e.id);
    const pendingRoomIds = res.flatMap((e) => e.requested ?? []).map((e) => e.id);

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
