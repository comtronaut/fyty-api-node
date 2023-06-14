import { Injectable } from "@nestjs/common";
import { MemberRole, PendingStatus, TeamMember, User } from "@prisma/client";

import { CreateTeamMemberDto, UpdateTeamMemberDto } from "model/dto/team-member.dto";
import { PrismaService } from "prisma/prisma.service";

import { TeamService } from "./team.service";
import { NotifyService } from "../notification/lineNotify.service";

@Injectable()
export class TeamMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamService: TeamService,
    private readonly lineNotify: NotifyService
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
        status: true,
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
        where: {
          id: pending.id
        }
      }),
      this.prisma.teamMember.create({
        data: { ...data, role: MemberRole.MEMBER }
      })
    ]);

    await this.deleteTeamPendingsOnUser(data.userId, team.gameId);

    // notify
    if (pending.status === PendingStatus.INCOMING) {
      void this.lineNotify.searchUserForTeamAcceptNotify(
        data.userId,
        data.teamId,
        "Accepted"
      );
    } else if (pending.status === PendingStatus.OUTGOING) {
      void this.lineNotify.searchUserForAcceptTeamNotify(
        data?.userId,
        data?.teamId,
        "Denied"
      );
    }

    return out;
  }

  async deleteTeamPendingsOnUser(userId: string, gameId?: string): Promise<void> {
    await this.prisma.teamPending.deleteMany({
      where: {
        userId,
        ...(gameId && {
          team: { gameId }
        })
      }
    });
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

      // notify
      void this.lineNotify.searchUserForTeamKickedNotify(memberId);
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
