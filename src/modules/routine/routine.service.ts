import { Injectable, MessageEvent, Sse } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TrainingSource, TrainingStatus } from "@prisma/client";
import dayjs from "dayjs";
import { compact } from "lodash";
import { Observable, Subject, map } from "rxjs";

import { EventSourceKey } from "common/constants/keys";
import { diffMinute } from "common/utils/time";
import { ImageService } from "modules/image/image.service";
import { RoomService } from "modules/room/room.service";
import { PrismaService } from "prisma/prisma.service";
import { RoomSystemRemoval } from "types/sse-payload";

import { NotifyService } from "../notification/lineNotify.service";

@Injectable()
export class RoutineService {
  private readonly roomSystemRemoval = new Subject<RoomSystemRemoval>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly roomService: RoomService,
    private readonly notifyService: NotifyService,
    private readonly imageService: ImageService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: "Asia/Bangkok" })
  async roomRoutine() {
    try {
      const timestamp = dayjs().add(5, "second").toDate();

      const rooms = await this.prisma.room.findMany({
        where: {
          endAt: {
            lte: timestamp
          }
        },
        select: {
          id: true,
          hostTeamId: true,
          startAt: true,
          endAt: true,
          game: {
            select: {
              teamCap: true
            }
          },
          lineups: {
            select: {
              teamLineupId: true
            }
          },
          members: {
            select: {
              teamId: true
            }
          },
          appointment: {
            select: {
              id: true
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
        rooms.map(({ startAt, endAt, members }) => {
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

      await Promise.all([
        // create training result
        this.prisma.training.createMany({
          data: rooms
            .filter((e) =>
              [
                e.appointment,
                e.members.length === e.game.teamCap,
                e.members.filter((f) => f.teamId !== e.hostTeamId).length
              ].every(Boolean)
            )
            .map((e) => ({
              appointmentId: e.appointment!.id,
              hostId: e.hostTeamId,
              guestId: e.members.filter((f) => f.teamId !== e.hostTeamId)[0]!.teamId,
              lineups: {
                createMany: {
                  data: e.lineups.map((e) => ({ lineupId: e.teamLineupId }))
                }
              }
            }))
        }),
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
      for (const room of rooms) {
        this.roomSystemRemoval.next({
          roomId: room.id,
          appointmentId: room.appointment!.id,
          isDone:
            room.members.length > 1
            && Boolean(room.members.filter((f) => f.teamId !== room.hostTeamId)[0])
        });
      }
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

      // find out of valid submission time trainings
      const toBeRemovedTrainings = await this.prisma.training.findMany({
        where: {
          createdAt: {
            lte: nextToBeRemovedTime
          },
          isSubmitted: false,
          source: TrainingSource.SYSTEM
        }
      });

      // make all submitted, unreviewed trainings to be accepted
      await this.prisma.training.updateMany({
        where: {
          createdAt: {
            lte: nextToBeRemovedTime
          },
          status: TrainingStatus.UNREVIEWED,
          source: TrainingSource.SYSTEM
        },
        data: {
          status: TrainingStatus.ACCEPTED
        }
      });

      if (!toBeRemovedTrainings.length) {
        return;
      }

      await this.prisma.training.updateMany({
        where: {
          id: { in: toBeRemovedTrainings.map((e) => e.id) }
        },
        data: {
          status: TrainingStatus.EXPIRED
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  @Sse(EventSourceKey.RoomSystemRemoval)
  sse(): Observable<MessageEvent> {
    return this.roomSystemRemoval.pipe(map((data) => ({ data })));
  }
}
