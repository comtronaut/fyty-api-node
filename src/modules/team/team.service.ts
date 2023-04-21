import { Injectable } from "@nestjs/common";
import { MemberRole, Team, User } from "@prisma/client";
import { paginate } from "common/utils/pagination";
import { CreateTeamDto, UpdateTeamDto } from "model/dto/team.dto";
import { PrismaService } from "prisma/prisma.service";
import { Pagination } from "types/local";
import { TeamDetail } from "types/query-detail";
import { RoomService } from "../room/room.service";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomService: RoomService
  ) {}

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
        },
        stats: {
          create: {}
        }
      }
    });
  }

  async getDetailById(teamId: string): Promise<TeamDetail> {
    const {
      settings,
      stats,
      lineups,
      members: memberRes,
      pendings,
      ...info
    } = await this.prisma.team.findUniqueOrThrow({
      where: { id: teamId },
      include: {
        settings: true,
        stats: true,
        lineups: true,
        members: {
          include: {
            user: true
          }
        },
        pendings: true
      }
    });

    const users = memberRes.map((e) => e.user);
    const members = memberRes.map(({ user, ...e }) => e);

    return {
      info,
      settings,
      stats,
      lineups,
      members,
      users,
      pendings
    };
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
      ...(filter.pagination && paginate(filter.pagination)),
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
    const { roomHosts } = await this.prisma.team.update({
      where: { id: teamId },
      data: {
        isDeleted: true,
        settings: {
          delete: true
        },
        stats: {
          delete: true
        },
        lineups: {
          deleteMany: {}
        },
        members: {
          deleteMany: {}
        },
        // all pendigns
        pendings: {
          deleteMany: {}
        },
        roomPendings: {
          deleteMany: {}
        },
        // delete upcoming/ongoing appointments and trainings
        roomMembers: {
          deleteMany: {}
        },
        appointmentMembers: {
          deleteMany: {
            isLeft: true
          }
        }
      },
      select: {
        roomHosts: {
          select: {
            id: true
          }
        }
      }
    });

    // TODO: add sse or notification

    await this.roomService.deleteMultiple(
      roomHosts.map((e) => e.id),
      true
    );
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
