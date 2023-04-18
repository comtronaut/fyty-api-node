import { Injectable } from "@nestjs/common";
import { MemberRole, Team, User } from "@prisma/client";
import { CreateTeamDto, UpdateTeamDto } from "src/model/dto/team.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Pagination } from "src/types/general";

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, data: CreateTeamDto): Promise<Team> {
    const teamMemberRes = await this.prisma.teamMember.findMany({
      where: { userId: user.id },
      select: {
        team: {
          select: {
            gameId: true
          }
        }
      }
    });

    const existedTeamGames = teamMemberRes.map((e) => e.team.gameId);
    if (existedTeamGames.includes(data.gameId)) {
      throw new Error("You already have team");
    }

    return await this.prisma.team.create({
      data: {
        ...data,
        members: {
          create: {
            userId: user.id,
            role: MemberRole.MANAGER
          }
        },
        settings: {
          create: {}
        }
      }
    });
  }

  async getById(teamId: string): Promise<Team> {
    return await this.prisma.team.findUniqueOrThrow({
      where: { id: teamId }
    });
  }

  async getByUserId(userId: string): Promise<Team[]> {
    const memberRes = await this.prisma.teamMember.findMany({
      where: { userId },
      select: {
        team: true
      }
    });

    return memberRes.map((e) => e.team);
  }

  async getByFilter(filter: {
    pagination?: Pagination;
    clause?: Partial<Team>;
  }): Promise<Team[]> {
    return await this.prisma.team.findMany({
      ...(filter.pagination && {
        skip: (filter.pagination.page - 1) * filter.pagination.perPage,
        take: filter.pagination.perPage
      }),
      ...(filter.clause && {
        where: {
          isDeleted: false,
          ...filter.clause
        }
      })
    });
  }

  async update(payload: UpdateTeamDto): Promise<Team> {
    return await this.prisma.team.update({
      where: { id: payload.id },
      data: payload
    });
  }

  async deleteSoftly(teamId: string): Promise<void> {
    await this.prisma.team.update({
      where: { id: teamId },
      data: {
        isDeleted: true,
        settings: {
          delete: true
        },
        lineups: {
          deleteMany: {}
        },
        members: {
          deleteMany: {}
        }
      }
    });
  }

  async deleteByUser(userId: string, teamId: string): Promise<void> {
    const member = await this.prisma.teamMember.findFirstOrThrow({
      where: { userId, teamId },
      select: { role: true }
    });

    if (member.role === MemberRole.MANAGER) {
      await this.deleteSoftly(teamId);
    } else {
      throw new Error("only Manager can delete team");
    }
  }
}
