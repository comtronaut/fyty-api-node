import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { MemberRole, PendingStatus } from "@prisma/client";
import axios from "axios";
import env from "src/common/env.config";
import { PrismaService } from "src/prisma/prisma.service";
import { Cache } from "cache-manager";

@Injectable()
export class NotifyService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async sendNotification(message: string, token: string): Promise<void> {
    const url = "https://notify-api.line.me/api/notify";
    const headers = { Authorization: `Bearer ${token}` };

    await axios.postForm(url, { message }, { headers });
  }

  async getAuthorizeUrl(userId: string): Promise<string> {
    const queryParams = new URLSearchParams({
      response_type: "code",
      client_id: env.LINE_NOTIFY_CLIENT_ID,
      redirect_uri: env.LINE_NOTIFY_REDIRECT_URI,
      scope: "notify",
      state: userId
    });

    return `https://notify-bot.line.me/oauth/authorize?${queryParams.toString()}`;
  }

  async authenticate(code: string) {
    // use lineNotify API
    const response = await axios.postForm("https://notify-bot.line.me/oauth/token", {
      grant_type: "authorization_code",
      code,
      redirect_uri: env.LINE_NOTIFY_REDIRECT_URI,
      client_id: env.LINE_NOTIFY_CLIENT_ID,
      client_secret: env.LINE_NOTIFY_CLIENT_SECRET
    });

    return response.data;
  }

  async callback(code: string, state: string): Promise<void> {
    try {
      // get lineNotify token
      const token = await this.authenticate(code);

      // update line_token in user
      const res = await this.prisma.user.update({
        where: {
          id: state
        },
        data: {
          lineToken: token.access_token
        }
      });

      await this.cacheManager.set(`user:${state}`, res);
    } catch (error) {
      console.error(error);
    }
  }

  async searchUserForAppointmentNotify(memberIds: string[]) {
    const member = await this.prisma.teamMember.findMany({
      where: {
        teamId: {
          in: memberIds
        }
      },
      select: {
        user: {
          select: {
            lineToken: true
          }
        }
      }
    });

    const tokens = member.map((e) => e.user.lineToken);

    for (const token of tokens) {
      if (token) {
        void this.sendNotification("คุณได้รับการนัดหมายแล้ว", token);
      }
    }
  }

  async searchUserForRequestNotify(roomId: string) {
    const roomRes = await this.prisma.room.findFirst({
      where: {
        id: roomId
      },
      select: {
        hostTeam: {
          select: {
            members: {
              select: {
                user: {
                  select: {
                    lineToken: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const tokens = roomRes?.hostTeam.members.map((e) => e.user.lineToken) ?? [];

    for (const token of tokens) {
      if (token) {
        void this.sendNotification("คุณได้รับการร้องขอเข้าห้อง", token);
      }
    }
  }

  async searchUserForTeamPendingNotify(teamId: string, userId: string, status: string) {
    if (status === PendingStatus.INCOMING) {
      const member = await this.prisma.teamMember.findMany({
        where: {
          teamId,
          role: {
            in: [ MemberRole.MANAGER, MemberRole.LEADER ]
          }
        },
        select: {
          user: {
            select: {
              lineToken: true
            }
          }
        }
      });

      const managerUsers = member.map((e) => e.user);

      if (managerUsers.length > 1) {
        managerUsers.map((e) => {
          if (e.lineToken !== null) {
            void this.sendNotification("คุณได้รับการร้องขอเข้าทีม", e.lineToken);
          }
        });
      } else {
        if (managerUsers !== null && managerUsers[0].lineToken !== null) {
          void this.sendNotification(
            "คุณได้รับการร้องขอเข้าทีม",
            managerUsers[0].lineToken
          );
        }
      }
    } else if (status === PendingStatus.OUTGOING) {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId
        }
      });

      if (user !== null && user.lineToken !== null) {
        void this.sendNotification("คุณได้รับการเชิญเข้าทีม", user.lineToken);
      }
    }
  }

  async searchUserForChatNotify(chatId: string, teamId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId
      }
    });

    const roomMemberRes = await this.prisma.roomMember.findMany({
      where: {
        roomId: chat?.roomId,
        NOT: { teamId }
      },
      select: {
        team: {
          select: {
            members: {
              select: {
                user: {
                  select: {
                    lineToken: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const lineTokenOfOtherUsers = roomMemberRes.flatMap((e) =>
      e.team.members.map((e) => e.user.lineToken)
    );

    for (const token of lineTokenOfOtherUsers) {
      if (token) {
        void this.sendNotification("คุณได้รับข้อความใหม่", token);
      }
    }
  }
}
