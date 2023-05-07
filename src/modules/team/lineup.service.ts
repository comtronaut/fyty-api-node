import { Injectable } from "@nestjs/common";
import { MemberRole, TeamLineup, User } from "@prisma/client";
import { CreateTeamLineupDto, UpdateLineupDto } from "model/dto/team-lineup.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class LineupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTeamLineupDto) {
    return await this.prisma.teamLineup.create({ data });
  }

  async update(user: User, lineupId: string, data: UpdateLineupDto) {
    const teamMember = await this.prisma.teamMember.findFirstOrThrow({
      where: { userId: user.id }
    });

    if ([ MemberRole.MANAGER, MemberRole.LEADER ].some((role) => role === teamMember.role)) {
      return await this.prisma.teamLineup.update({
        where: { id: lineupId },
        data
      });
    } else {
      throw new Error("Only team's Manager can edit lineups");
    }
  }

  async getByTeamId(teamId: string): Promise<TeamLineup[]> {
    return await this.prisma.teamLineup.findMany({
      where: { teamId }
    });
  }

  async getById(lineupId: string): Promise<TeamLineup> {
    return await this.prisma.teamLineup.findUniqueOrThrow({
      where: { id: lineupId }
    });
  }

  async getByRoomMemberId(memberid: string): Promise<TeamLineup[]> {
    const { roomLineups } = await this.prisma.roomMember.findUniqueOrThrow({
      where: { id: memberid },
      select: {
        roomLineups: {
          select: {
            teamLineup: true
          }
        }
      }
    });

    return roomLineups.map((e) => e.teamLineup);
  }

  async deleteById(userId: string, lineupId: string) {
    const { team } = await this.prisma.teamLineup.findUniqueOrThrow({
      where: { id: lineupId },
      select: { team: true }
    });
    const member = await this.prisma.teamMember.findFirstOrThrow({
      where: { userId, teamId: team.id }
    });

    if ([ MemberRole.MANAGER, MemberRole.LEADER ].some((role) => role === member.role)) {
      await this.prisma.teamLineup.delete({ where: { id: lineupId } });
    } else {
      throw new Error("Only team's Manager can edit lineups");
    }
  }
}
