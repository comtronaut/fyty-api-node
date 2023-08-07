import { Injectable } from "@nestjs/common";
import {
  Team,
  TeamStats,
  Training,
  TrainingLineup,
  TrainingReport,
  TrainingSource,
  TrainingStatus
} from "@prisma/client";
import { compact } from "lodash";
import { Nullable } from "tsdef";
import { z } from "zod";

import { paginate } from "common/utils/pagination";
import { diffMinute } from "common/utils/time";
import {
  CreateTrainingReportDto,
  UpdateTrainingReportDto
} from "model/dto/training-report.dto";
import {
  CreateTrainingBypassDto,
  UpdateTrainingDto
} from "model/dto/training.dto";
import { PrismaService } from "prisma/prisma.service";
import { Pagination } from "types/local";

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBypass(
    payload: CreateTrainingBypassDto,
    source: TrainingSource
  ): Promise<Training> {
    const { startAt, endAt, ...trainingPayload } = payload;

    // create a designated team if the team didn't exist
    let newGuestId = null;
    if (!z.string().cuid().safeParse(payload.guestId).success) {
      const hostTeam = await this.prisma.team.findUniqueOrThrow({
        where: { id: payload.hostId },
        select: { gameId: true }
      });

      const { id } = await this.prisma.team.create({
        data: {
          gameId: hostTeam.gameId,
          designatorTeamId: payload.hostId,
          name: payload.guestId,
          settings: {
            create: {}
          },
          stats: {
            create: {}
          }
        },
        select: { id: true }
      });

      newGuestId = id;
    }

    const { training } = await this.prisma.appointment.create({
      data: {
        startAt,
        endAt,
        isDeleted: true,
        members: {
          create: [
            {
              teamId: payload.hostId,
              isLeft: false
            },
            {
              teamId: newGuestId ?? payload.guestId,
              isLeft: false
            }
          ]
        },
        training: {
          create: {
            ...trainingPayload,
            ...(newGuestId && { guestId: newGuestId }),
            status: TrainingStatus.ACCEPTED,
            isSubmitted: true,
            source
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
        where: { teamId: { in: compact([ host!.id, guest!.id ]) } },
        data: {
          trainingMinute: {
            increment: diffMinute(payload.startAt, payload.endAt)
          },
          completedTrainingCount: {
            increment: 1
          }
        }
      });
    }

    return training!;
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

  async getTrainingLineupsById(trainingId: string): Promise<TrainingLineup[]> {
    return await this.prisma.trainingLineup.findMany({ where: { trainingId } });
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
      },
      orderBy: {
        appointment: {
          startAt: "desc"
        }
      }
    });
  }

  async update(id: string, data: UpdateTrainingDto): Promise<Training> {
    // update training count stats
    if (data.isSubmitted) {
      const { hostId, guestId } = await this.prisma.training.findUniqueOrThrow({
        where: { id },
        select: {
          hostId: true,
          guestId: true
        }
      });

      await this.prisma.teamStats.updateMany({
        where: {
          teamId: { in: compact([ hostId, guestId ]) }
        },
        data: {
          completedTrainingCount: {
            increment: 1
          }
        }
      });
    }

    const { host, guest, ...currentTraining } = await this.prisma.training.findFirstOrThrow(
      {
        where: { id },
        include: {
          host: true,
          guest: true
        }
      }
    );

    if (Number.isFinite(data.hostWinCount) && Number.isFinite(data.hostLoseCount)) {
      await this.compareAndUpdateParticipants(
        host,
        guest,
        {
          hostWinCount: currentTraining.hostWinCount,
          hostLoseCount: currentTraining.hostLoseCount
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

    if (isNewTie) {
      await this.prisma.teamStats.updateMany({
        where: {
          teamId: { in: compact([ host?.id, guest?.id ]) }
        },
        data: {
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
      });
    } else {
      if (host) {
        await this.prisma.teamStats.update({
          where: { teamId: host.id },
          data: {
            winCount: {
              increment: !isNewTie && isNewHostWin ? 1 : 0
            },
            loseCount: {
              increment: !isNewTie && isNewHostLose ? 1 : 0
            },
            perGameWinCount: {
              increment: (newRes.hostWinCount || 0) - (oldRes.hostWinCount || 0)
            },
            perGameLoseCount: {
              increment: (newRes.hostLoseCount || 0) - (oldRes.hostLoseCount || 0)
            }
          }
        });
      }
      if (guest) {
        await this.prisma.teamStats.update({
          where: { teamId: guest.id },
          data: {
            winCount: {
              increment: isNewHostWin ? 0 : 1
            },
            loseCount: {
              increment: isNewHostLose ? 0 : 1
            },
            perGameWinCount: {
              increment: (newRes.hostLoseCount || 0) - (oldRes.hostLoseCount || 0)
            },
            perGameLoseCount: {
              increment: (newRes.hostWinCount || 0) - (oldRes.hostWinCount || 0)
            }
          }
        });
      }
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

    if (isOldTie) {
      await this.prisma.teamStats.updateMany({
        where: {
          teamId: { in: compact([ host?.id, guest?.id ]) }
        },
        data: {
          tieCount: {
            decrement: isOldTie ? 1 : 0
          },
          perGameWinCount: {
            decrement: (oldRes.hostWinCount || 0) - (oldRes.hostWinCount || 0)
          },
          perGameLoseCount: {
            decrement: (oldRes.hostLoseCount || 0) - (oldRes.hostLoseCount || 0)
          }
        }
      });
    } else {
      if (host) {
        await this.prisma.teamStats.update({
          where: { teamId: host.id },
          data: {
            winCount: {
              decrement: isOldHostWin ? 1 : 0
            },
            loseCount: {
              decrement: isOldHostLose ? 1 : 0
            },
            perGameWinCount: {
              decrement: oldRes.hostWinCount || 0
            },
            perGameLoseCount: {
              decrement: oldRes.hostLoseCount || 0
            }
          }
        });
      }
      if (guest) {
        await this.prisma.teamStats.update({
          where: { teamId: guest.id },
          data: {
            winCount: {
              decrement: isOldHostWin ? 0 : 1
            },
            loseCount: {
              decrement: isOldHostLose ? 0 : 1
            },
            perGameWinCount: {
              decrement: oldRes.hostLoseCount || 0
            },
            perGameLoseCount: {
              decrement: oldRes.hostWinCount || 0
            }
          }
        });
      }
    }
  }

  async deleteReportById(id: string): Promise<void> {
    await this.prisma.trainingReport.delete({
      where: { id }
    });
  }

  async deleteById(id: string): Promise<void> {
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

    if (appointment) {
      const { startAt, endAt } = appointment;

      await this.prisma.teamStats.updateMany({
        where: { teamId: { in: compact([ host!.id, guest!.id ]) } },
        data: {
          trainingMinute: {
            decrement: diffMinute(startAt, endAt)
          },
          completedTrainingCount: {
            decrement: 1
          },
          trainingCount: {
            decrement: 1
          }
        }
      });
    }

    // delete training
    await this.prisma.training.delete({
      where: { id }
    });
  }
}
