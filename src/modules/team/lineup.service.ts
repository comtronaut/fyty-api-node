import { BadRequestException, Injectable } from "@nestjs/common";
import { MemberRole, User } from "@prisma/client";
import { CreateTeamLineupDto, UpdateLineUpDto } from "src/model/dto/team-lineup.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LineupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTeamLineupDto) {
    try {
      return await this.prisma.teamLineup.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(user: User, lineUpId: string, data: UpdateLineUpDto) {
    try {
      const teamMember = await this.prisma.teamMember.findFirstOrThrow({
        where: { userId: user.id }
      });

      if ([ MemberRole.MANAGER, MemberRole.LEADER ].some((role) => role === teamMember.role)) {
        return await this.prisma.teamLineup.update({
          where: { id: lineUpId },
          data
        });
      } else {
        throw new Error("Only team's Manager can edit lineUps");
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineupsByTeamId(teamId: string) {
    try {
      return await this.prisma.teamLineup.findFirstOrThrow({
        where: { teamId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineUpById(lineUpId: string) {
    try {
      return await this.prisma.teamLineup.findUniqueOrThrow({
        where: { id: lineUpId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamLineupsByRoomMemberId(participantId: string) {
    try {
      const { roomLineups } = await this.prisma.roomMember.findUniqueOrThrow({
        where: { id: participantId },
        include: { roomLineups: true }
      });

      return await this.prisma.teamLineup.findMany({
        where: {
          id: {
            in: roomLineups.map((e) => e.teamLineupId)
          }
        }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteAllLineups(userId: string, teamId: string) {
    try {
      const member = await this.prisma.teamMember.findFirstOrThrow({
        where: { teamId, userId }
      });

      if ([ MemberRole.MANAGER, MemberRole.LEADER ].some((role) => role === member.role)) {
        await this.prisma.teamLineup.deleteMany({ where: { teamId } });
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteById(userId: string, lineupId: string) {
    try {
      const { team } = await this.prisma.teamLineup.findUniqueOrThrow({
        where: { id: lineupId },
        include: { team: true }
      });
      const member = await this.prisma.teamMember.findFirstOrThrow({
        where: { userId, teamId: team.id }
      });

      if ([ MemberRole.MANAGER, MemberRole.LEADER ].some((role) => role === member.role)) {
        await this.prisma.teamLineup.delete({ where: { id: lineupId } });
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
