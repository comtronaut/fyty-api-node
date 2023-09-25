import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationActionResponse } from "@prisma/client";

import { NotifUserRoomRegistrationDto } from "model/dto/notif-user-room-registration.dto";
import {
  NotificationDto,
  NotificationOnHostingRoomsResponseDto,
  NotificationPackResponseDto
} from "model/dto/notification.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async getNotificationsByUserId(userId: string): Promise<NotificationPackResponseDto> {
    const { receivingNotifications, roomNotifRegistrations, teamPendings, teamMembers }
      = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          receivingNotifications: {
            include: {
              action: true
            }
          },
          roomNotifRegistrations: true,
          teamPendings: {
            where: { status: "OUTGOING" },
            select: { id: true }
          },
          teamMembers: {
            select: {
              team: {
                select: {
                  pendings: {
                    where: { status: "INCOMING" },
                    select: { id: true }
                  },
                  roomHosts: {
                    select: {
                      pendings: {
                        where: { status: "INCOMING" },
                        select: { id: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

    const meNotifyingCount = teamPendings.length;
    const roomMessageNotifyingCount = roomNotifRegistrations.reduce(
      (acc, x) => acc + x.unreadCount,
      0
    );
    const teamNotifyingCount = teamMembers.reduce(
      (acc, { team }) =>
        acc
        + team.pendings.length
        + team.roomHosts.reduce((acc, x) => acc + x.pendings.length, 0),
      0
    );

    return {
      receivingNotifications,
      roomNotifRegistrations,
      meNotifyingCount,
      roomMessageNotifyingCount,
      teamNotifyingCount
    };
  }

  async getNotificationsOnHostingRoomsByUserId(
    userId: string,
    gameId?: string,
    teamId?: string,
    eventId?: string
  ): Promise<NotificationOnHostingRoomsResponseDto> {
    return await this.prisma.room.findMany({
      where: {
        hostTeam: {
          ...(gameId && { gameId }),
          ...(teamId && { id: teamId }),
          members: {
            some: {
              userId
            }
          }
        },
        appointment: {
          eventRound: eventId ? { eventId } : null
        }
      },
      include: {
        pendings: true,
        appointment: true,
        members: true
      }
    });
  }

  async markAsReadNotificationById(id: string): Promise<NotificationDto> {
    return await this.prisma.notification.update({
      where: { id },
      data: {
        seenAt: new Date()
      }
    });
  }

  async performActionNotificationById(
    id: string,
    action: NotificationActionResponse
  ): Promise<NotificationDto> {
    return await this.prisma.notification.update({
      where: { id },
      data: {
        seenAt: new Date(),
        action: {
          update: {
            response: action
          }
        }
      }
    });
  }

  async markAsReadNotifUserRoomRegistrationById(
    id: string
  ): Promise<NotifUserRoomRegistrationDto> {
    return await this.prisma.notifUserRoomRegistration.update({
      where: { id },
      data: {
        unreadCount: 0
      }
    });
  }

  async sendChatMessageNotificationToOthers(
    chatId: string,
    senderUserId: string,
    message: string
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId }
    });

    const roomMemberRes = await this.prisma.roomMember.findMany({
      where: {
        roomId: chat?.roomId
      },
      select: {
        team: {
          select: {
            members: {
              select: {
                user: {
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const toBeNotifiedUserIds = roomMemberRes
      .flatMap((e) => e.team.members)
      .map((e) => e.user.id)
      .filter((e) => e !== senderUserId);

    await this.prisma.notifUserRoomRegistration.updateMany({
      where: {
        userId: { in: toBeNotifiedUserIds }
      },
      data: {
        latestMessage: message,
        unreadCount: {
          increment: 1
        }
      }
    });

    toBeNotifiedUserIds.map((id) =>
      this.eventEmitter.emit("socket.notification-room-message", {
        receiverUserId: id,
        message
      })
    );
  }
}
