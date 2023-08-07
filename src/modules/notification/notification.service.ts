import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationActionResponse } from "@prisma/client";

import { NotifUserRoomRegistrationDto } from "model/dto/notif-user-room-registration.dto";
import { NotificationDto, NotificationPackResponseDto } from "model/dto/notification.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async getNotificationsByUserId(userId: string): Promise<NotificationPackResponseDto> {
    const { receivingNotifications, roomNotifRegistrations }
      = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          receivingNotifications: {
            include: {
              action: true
            }
          },
          roomNotifRegistrations: true
        }
      });

    return { receivingNotifications, roomNotifRegistrations };
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
        unreadCount: 0,
        latestMessage: ""
      }
    });
  }

  async sendChatMessageNotificationToOthers(
    chatId: string,
    userId: string,
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
      .filter((e) => e !== userId);

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
