import { Injectable } from "@nestjs/common";
import { Team, TeamStats, Training, TrainingReport } from "@prisma/client";
import { paginate } from "common/utils/pagination";
import { diffMinute } from "common/utils/time";
import {
  CreateTrainingReportDto,
  UpdateTrainingReportDto
} from "model/dto/training-report.dto";
import { CreateTrainingDto, UpdateTrainingDto } from "model/dto/training.dto";
import { PrismaService } from "prisma/prisma.service";
import { Nullable } from "tsdef";
import { Pagination } from "types/local";

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBypass(payload: any): Promise<Training> {
    const { training } = await this.prisma.appointment.create({
      data: {
        startAt: payload.startAt,
        endAt: payload.endAt,
        isDeleted: true,
        members: {
          create: [
            {
              teamId: payload.hostId,
              isLeft: true
            },
            {
              teamId: payload.guestId,
              isLeft: true
            }
          ]
        },
        training: {
          create: {
            hostId: payload.hostId,
            guestId: payload.guestId,
            isSubmitted: true
          }
        }
      },
      select: {
        training: {
          include: {
            host: true,
            guest: true
          }
        }
      }
    });

    if (training) {
      const { host, guest } = training;

      await this.compareAndUpdateParticipants(
        host!,
        guest!,
        {
          hostLoseCount: null,
          hostWinCount: null
        },
        {
          hostLoseCount: payload.hostLoseCount,
          hostWinCount: payload.hostWinCount
        }
      );

      await this.prisma.teamStats.updateMany({
        where: { teamId: { in: [ host!.id, guest!.id ].filter(Boolean) } },
        data: {
          trainingMinute: {
            increment: diffMinute(payload.startAt, payload.endAt)
          },
          trainingCount: {
            increment: 1
          }
        }
      });
    }

    return training!;
  }

  async create(data: CreateTrainingDto): Promise<Training> {
    return await this.prisma.training.create({
      data
    });
  }

  async getAll(): Promise<Training[]> {
    return await this.prisma.training.findMany({
      include: {
        appointment: {
          select: {
            startAt: true,
            endAt: true
          }
        }
      }
    });
  }

  async getAllReports(): Promise<TrainingReport[]> {
    return await this.prisma.trainingReport.findMany();
  }

  async getById(id: string): Promise<Training> {
    return await this.prisma.training.findUniqueOrThrow({
      where: { id },
      include: {
        appointment: {
          select: {
            startAt: true,
            endAt: true
          }
        }
      }
    });
  }

  async getReportById(reportId: string): Promise<TrainingReport> {
    return await this.prisma.trainingReport.findUniqueOrThrow({
      where: { id: reportId }
    });
  }

  async getReportsByTeamId(teamId: string): Promise<TrainingReport[]> {
    return await this.prisma.trainingReport.findMany({
      where: { reporterTeamId: teamId }
    });
  }

  async createReport(data: CreateTrainingReportDto): Promise<TrainingReport> {
    return await this.prisma.trainingReport.create({
      data
    });
  }

  async updateReport(
    reportId: string,
    data: UpdateTrainingReportDto
  ): Promise<TrainingReport> {
    return await this.prisma.trainingReport.update({
      where: { id: reportId },
      data: {
        ...data
      }
    });
  }

  async getTeamStats(teamId: string): Promise<TeamStats | null> {
    return await this.prisma.teamStats.findUniqueOrThrow({
      where: { teamId }
    });
  }

  async getByTeamId(teamId: string, pagination?: Pagination): Promise<Training[]> {
    return await this.prisma.training.findMany({
      ...(pagination && paginate(pagination)),
      where: {
        OR: [{ hostId: teamId }, { guestId: teamId }]
      },
      include: {
        appointment: {
          select: {
            startAt: true,
            endAt: true
          }
        }
      }
    });
  }

  async update(id: string, data: UpdateTrainingDto): Promise<Training> {
    const { host, guest, ...previousTraining }
      = await this.prisma.training.findFirstOrThrow({
        where: { id },
        include: {
          host: true,
          guest: true
        }
      });

    if (Number.isFinite(data.hostWinCount) && Number.isFinite(data.hostLoseCount)) {
      await this.compareAndUpdateParticipants(
        host,
        guest,
        {
          hostWinCount: previousTraining.hostWinCount,
          hostLoseCount: previousTraining.hostLoseCount
        },
        {
          hostWinCount: data.hostWinCount ?? null,
          hostLoseCount: data.hostLoseCount ?? null
        }
      );
    }

    return await this.prisma.training.update({
      where: { id },
      data
    });
  }

  async compareAndUpdateParticipants(
    host: Nullable<Team>,
    guest: Nullable<Team>,
    oldRes: Pick<Training, "hostWinCount" | "hostLoseCount">,
    newRes: Pick<Training, "hostWinCount" | "hostLoseCount">
  ) {
    const fromNull = oldRes.hostWinCount === null && Number.isFinite(newRes.hostLoseCount);
    const toNull = Number.isFinite(oldRes.hostWinCount) && newRes.hostLoseCount === null;
    const toExisted
      = Number.isFinite(oldRes.hostWinCount) && Number.isFinite(newRes.hostLoseCount);

    const isNewHostWin = (newRes.hostWinCount || 0) > (newRes.hostLoseCount || 0);
    const isNewHostLose = (newRes.hostWinCount || 0) < (newRes.hostLoseCount || 0);
    const isNewTie = newRes.hostWinCount === newRes.hostLoseCount;

    if (toNull || toExisted) {
      await this.resetParticipants(host, guest, oldRes);
    }
    if (!fromNull) {
      return;
    }

    if (host) {
      await this.prisma.team.update({
        where: { id: host.id },
        data: {
          stats: {
            update: {
              winCount: {
                increment: isNewHostWin ? 1 : 0
              },
              loseCount: {
                increment: isNewHostLose ? 1 : 0
              },
              tieCount: {
                increment: isNewTie ? 1 : 0
              },
              perGameWinCount: {
                increment: (newRes.hostWinCount || 0) - (oldRes.hostWinCount || 0)
              },
              perGameLoseCount: {
                increment: (newRes.hostLoseCount || 0) - (oldRes.hostLoseCount || 0)
              }
            }
          }
        }
      });
    }
    if (guest) {
      await this.prisma.team.update({
        where: { id: guest.id },
        data: {
          stats: {
            update: {
              winCount: {
                increment: isNewHostWin ? 0 : 1
              },
              loseCount: {
                increment: isNewHostLose ? 0 : 1
              },
              tieCount: {
                increment: isNewTie ? 1 : 0
              },
              perGameWinCount: {
                increment: (newRes.hostLoseCount || 0) - (oldRes.hostLoseCount || 0)
              },
              perGameLoseCount: {
                increment: (newRes.hostWinCount || 0) - (oldRes.hostWinCount || 0)
              }
            }
          }
        }
      });
    }
  }

  async resetParticipants(
    host: Nullable<Team>,
    guest: Nullable<Team>,
    oldRes: Pick<Training, "hostWinCount" | "hostLoseCount">
  ) {
    const isOldHostWin = (oldRes.hostWinCount || 0) > (oldRes.hostLoseCount || 0);
    const isOldHostLose = (oldRes.hostWinCount || 0) < (oldRes.hostLoseCount || 0);
    const isOldTie = oldRes.hostWinCount === oldRes.hostLoseCount;

    if (host) {
      await this.prisma.team.update({
        where: { id: host.id },
        data: {
          stats: {
            update: {
              winCount: {
                decrement: isOldHostWin ? 1 : 0
              },
              loseCount: {
                decrement: isOldHostLose ? 1 : 0
              },
              tieCount: {
                decrement: isOldTie ? 1 : 0
              },
              perGameWinCount: {
                decrement: oldRes.hostWinCount || 0
              },
              perGameLoseCount: {
                decrement: oldRes.hostLoseCount || 0
              }
            }
          }
        }
      });
    }
    if (guest) {
      await this.prisma.team.update({
        where: { id: guest.id },
        data: {
          stats: {
            update: {
              winCount: {
                decrement: isOldHostWin ? 0 : 1
              },
              loseCount: {
                decrement: isOldHostLose ? 0 : 1
              },
              tieCount: {
                decrement: isOldTie ? 1 : 0
              },
              perGameWinCount: {
                decrement: oldRes.hostLoseCount || 0
              },
              perGameLoseCount: {
                decrement: oldRes.hostWinCount || 0
              }
            }
          }
        }
      });
    }
  }

  async deleteReport(id: string): Promise<void> {
    await this.prisma.trainingReport.delete({
      where: { id }
    });
  }

  async delete(id: string): Promise<void> {
    const { host, guest, appointment, ...previousTraining }
      = await this.prisma.training.findUniqueOrThrow({
        where: { id },
        include: {
          host: true,
          guest: true,
          appointment: {
            select: {
              startAt: true,
              endAt: true
            }
          }
        }
      });

    const { hostWinCount, hostLoseCount } = previousTraining;

    // update stats
    await this.resetParticipants(host, guest, { hostWinCount, hostLoseCount });

    /* if (appointment) {
      const { startAt, endAt } = appointment;

      await this.prisma.teamStats.updateMany({
        where: { teamId: { in: [ host!.id, guest!.id ].filter(Boolean) } },
        data: {
          trainingMinute: {
            decrement: diffMinute(startAt, endAt)
          },
          trainingCount: {
            decrement: 1
          }
        }
      });
    } */

    // delete training
    await this.prisma.training.delete({
      where: { id }
    });
  }
}
