import { Injectable } from "@nestjs/common";
import { MemberRole, Team, TeamStats, User } from "@prisma/client";

import { paginate } from "common/utils/pagination";
import sortArrayByIdOrder from "common/utils/sortArrayByIdOrder";
import { CreateTeamDto, TeamDetailResponseDto, UpdateTeamDto } from "model/dto/team.dto";
import { LineNotifyService } from "modules/notification/line-notify.service";
import { RoomService } from "modules/room/room.service";
import { PrismaService } from "prisma/prisma.service";
import { Pagination } from "types/local";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomService: RoomService,
    private readonly lineNotify: LineNotifyService
  ) {}

  async createEmptyTeam(data: CreateTeamDto): Promise<Team> {
    return await this.prisma.team.create({
      data: {
        ...data,
        settings: {
          create: {}
        },
        stats: {
          create: {}
        }
      }
    });
  }

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

    await this.deleteTeamPendingsOnUser(user.id, data.gameId);

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

  async getDetailById(teamId: string): Promise<TeamDetailResponseDto> {
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

  async getByIds(teamIds: string[]): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({
      where: { id: { in: teamIds } }
    });

    return sortArrayByIdOrder(teams, teamIds);
  }

  async getById(teamId: string): Promise<Team> {
    return await this.prisma.team.findUniqueOrThrow({
      where: { id: teamId }
    });
  }

  async getByUserId(userId: string): Promise<Team[]> {
    return await this.prisma.team.findMany({
      where: {
        members: {
          some: { userId }
        }
      }
    });
  }

  async getStatsByTeamId(teamId: string): Promise<TeamStats> {
    return await this.prisma.teamStats.findUniqueOrThrow({
      where: { teamId }
    });
  }

  async getFilter(filter: {
    pagination?: Pagination;
    clause?: Partial<Team>;
  }): Promise<Team[]> {
    return await this.prisma.team.findMany({
      ...(filter.pagination && paginate(filter.pagination)),
      ...(filter.clause && {
        where: {
          isDeleted: false,
          designatorTeamId: null,
          ...filter.clause,
          ...(filter.clause.name && {
            name: {
              contains: filter.clause.name,
              mode: "insensitive"
            }
          })
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
        // stat will not be deleted
        /* stats: {
          delete: true
        }, */
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
    // notify
    void this.lineNotify.searchUserForTeamDisbandNotify(teamId);

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
