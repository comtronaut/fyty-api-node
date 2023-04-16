import { Injectable } from "@nestjs/common";
import { MemberRole, TeamMember, User } from "@prisma/client";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "src/model/dto/team-member";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TeamMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTeamMemberDto) {
    const pending = await this.prisma.teamPending.findUniqueOrThrow({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: data.userId
        }
      },
      select: { id: true }
    });
    const team = await this.prisma.team.findUniqueOrThrow({
      where: { id: data.teamId },
      select: { gameId: true }
    });
    const existedTeamInAGame = await this.prisma.teamMember.findFirst({
      where: { userId: data.userId, team },
      select: { id: true }
    });

    if (existedTeamInAGame) {
      throw new Error("This user already joined team");
    }

    const [ , out ] = await Promise.all([
      this.prisma.teamPending.delete({
        where: pending
      }),
      this.prisma.teamMember.create({
        data: { ...data, role: MemberRole.MEMBER }
      })
    ]);

    return out;
  }

  async update(teamMemberId: string, data: UpdateTeamMemberDto): Promise<TeamMember> {
    return await this.prisma.teamMember.update({
      where: { id: teamMemberId },
      data
    });
  }

  async getTeamId(teamId: string): Promise<TeamMember[]> {
    return await this.prisma.teamMember.findMany({ where: { teamId } });
  }

  async kickMember(memberId: string, user: User) {
    const userMember = await this.prisma.teamMember.findFirstOrThrow({
      where: { userId: user.id }
    });

    if ([ MemberRole.MANAGER, MemberRole.LEADER ].some((role) => role === userMember.role)) {
      await this.prisma.teamMember.delete({
        where: { id: memberId }
      });
    } else {
      throw new Error("Permission denined");
    }
  }

  async leaveTeam(teamMemberId: string) {
    const { teamId } = await this.prisma.teamMember.delete({
      where: { id: teamMemberId },
      select: { teamId: true }
    });

    const memberCount = await this.prisma.teamMember.count({
      where: { teamId }
    });

    // remove team if has no members left
    if (memberCount <= 0) {
      await this.prisma.team.update({
        where: { id: teamId },
        data: { isDeleted: true, lineups: { deleteMany: {} } }
      });
    }
  }
}
