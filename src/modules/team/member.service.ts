import { Injectable } from "@nestjs/common";
import { MemberRole, TeamMember, User } from "@prisma/client";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "model/dto/team-member.dto";
import { PrismaService } from "prisma/prisma.service";
import { TeamService } from "./team.service";

@Injectable()
export class TeamMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamService: TeamService
  ) {}

  async create(data: CreateTeamMemberDto) {
    const { team, ...pending } = await this.prisma.teamPending.findUniqueOrThrow({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: data.userId
        }
      },
      select: {
        id: true,
        team: {
          select: {
            gameId: true
          }
        }
      }
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

  async getByTeamId(teamId: string): Promise<TeamMember[]> {
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

    const livingMembers = await this.prisma.teamMember.findMany({
      where: { teamId }
    });

    // if the manager leave set a new manager
    if (
      livingMembers.every((e) => e.role !== MemberRole.MANAGER)
      && livingMembers.length > 0
    ) {
      const nonManagerMember = livingMembers.find((e) => e.role !== MemberRole.MANAGER);

      await this.prisma.teamMember.update({
        where: { id: nonManagerMember?.id },
        data: { role: MemberRole.MANAGER }
      });
    }

    // remove team if has no members left
    if (livingMembers.length <= 0) {
      await this.teamService.deleteSoftly(teamId);
    }
  }
}
