import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TrainingSource, TrainingStatus } from "@prisma/client";
import dayjs from "dayjs";
import { compact } from "lodash";

import { diffMinute } from "common/utils/time";
import { ImageService } from "modules/image/image.service";
import { RoomService } from "modules/room/room.service";
import { PrismaService } from "prisma/prisma.service";

import { LineNotifyService } from "../notification/line-notify.service";

@Injectable()
export class RoutineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomService: RoomService,
    private readonly notifyService: LineNotifyService,
    private readonly imageService: ImageService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: "Asia/Bangkok" })
  async roomRoutine() {
    try {
      const timestamp = dayjs().add(5, "second").toDate();

      const rooms = await this.prisma.room.findMany({
        where: {
          appointment: {
            endAt: {
              lte: timestamp
            }
          }
        },
        select: {
          id: true,
          hostTeamId: true,
          game: {
            select: {
              teamCap: true
            }
          },
          members: {
            select: {
              teamId: true,
              lineups: {
                select: {
                  teamLineupId: true
                }
              }
            }
          },
          appointment: {
            select: {
              id: true,
              startAt: true,
              endAt: true,
              training: true
            }
          },
          chat: {
            select: {
              messages: {
                select: {
                  imageUrls: true
                }
              }
            }
          }
        }
      });

      if (!rooms.length) {
        return;
      }

      const imageIds = rooms
        .flatMap((e) => e.chat?.messages.flatMap((e) => e.imageUrls) ?? [])
        .map((e) => this.imageService.extractCuidFromUrl(e));

      // update team stats
      void Promise.all(
        rooms.map(({ appointment: { startAt, endAt }, members }) => {
          const teamIds = members.map((e) => e.teamId);

          return this.prisma.teamStats.updateMany({
            where: { teamId: { in: teamIds } },
            data: {
              trainingMinute: {
                increment: diffMinute(startAt, endAt)
              },
              trainingCount: {
                increment: 1
              }
            }
          });
        })
      );

      const trainingCreatableRooms = rooms.filter(
        (e) =>
          e.appointment
          && e.members.length === e.game.teamCap
          && e.members.filter((f) => f.teamId !== e.hostTeamId).length
          && !e.appointment.training
      );

      await Promise.all([
        // create training result
        ...trainingCreatableRooms.map((e) =>
          this.prisma.training.create({
            data: {
              appointmentId: e.appointment!.id,
              hostId: e.hostTeamId,
              guestId: e.members.filter((f) => f.teamId !== e.hostTeamId)[0]!.teamId,
              lineups: {
                createMany: {
                  data: e.members
                    .flatMap((m) => m.lineups)
                    .map((e) => ({ lineupId: e.teamLineupId }))
                }
              }
            }
          })
        ),
        // delete images
        this.imageService.deleteImageByIds(compact(imageIds)),
        // delete rooms
        this.roomService.deleteMultiple(
          rooms.map((room) => room.id),
          false,
          true
        )
      ]);

      // send notifications
      rooms.map((room) =>
        this.eventEmitter.emit("socket.room-system-removal", { roomId: room.id })
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  @Cron(CronExpression.EVERY_HOUR, { timeZone: "Asia/Bangkok" })
  async trainingRoutine() {
    try {
      const nextToBeRemovedTime = dayjs().add(-1, "day").toDate();

      await Promise.all([
        // find out of valid submission time trainings
        this.prisma.training.updateMany({
          where: {
            OR: [
              {
                createdAt: {
                  lte: nextToBeRemovedTime
                },
                appointment: {
                  eventRoundId: null
                }
              },
              {
                appointment: {
                  eventRound: {
                    endAt: {
                      lte: nextToBeRemovedTime
                    }
                  }
                }
              }
            ],
            isSubmitted: false,
            status: TrainingStatus.UNREVIEWED,
            source: TrainingSource.SYSTEM
          },
          data: {
            status: TrainingStatus.EXPIRED
          }
        }),
        // make all submitted, unreviewed trainings to be accepted
        this.prisma.training.updateMany({
          where: {
            OR: [
              {
                createdAt: {
                  lte: nextToBeRemovedTime
                },
                appointment: {
                  eventRoundId: null
                }
              },
              {
                appointment: {
                  eventRound: {
                    endAt: {
                      lte: nextToBeRemovedTime
                    }
                  }
                }
              }
            ],
            isSubmitted: true,
            status: TrainingStatus.UNREVIEWED,
            source: TrainingSource.SYSTEM
          },
          data: {
            status: TrainingStatus.ACCEPTED
          }
        })
      ]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }
}
