import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { MemberRole, PendingStatus } from "@prisma/client";
import axios from "axios";
import { Cache } from "cache-manager";

import env from "common/env.config";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class LineNotifyService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async sendNotification(message: string, token: string): Promise<void> {
    const url = "https://notify-api.line.me/api/notify";
    const headers = { Authorization: `Bearer ${token}` };

    await axios.postForm(url, { message }, { headers });
  }

  async getAuthorizeUrl(userId: string, stage?: string): Promise<string> {
    const queryParams = new URLSearchParams({
      response_type: "code",
      client_id: env.LINE_NOTIFY_CLIENT_ID,
      redirect_uri: env.LINE_NOTIFY_REDIRECT_URI,
      scope: "notify",
      state: stage ? `${userId}:${stage}` : userId
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

  async callback(code: string, userId: string): Promise<void> {
    try {
      const token = await this.authenticate(code);

      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          lineToken: token.access_token
        }
      });

      await this.cacheManager.set(`user:${userId}`, updatedUser);
    } catch (error) {
      console.error(error);
    }
  }

  // Appointment
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
            settings: {
              select: {
                isMeNotified: true,
                isRoomNotified: true,
                isTeamNotified: true
              }
            },
            lineToken: true
          }
        }
      }
    });

    const tokens
      = member.map((e) => ({
        token: e.user.lineToken,
        isMe: e.user.settings?.isMeNotified,
        isRoom: e.user.settings?.isRoomNotified,
        isTeam: e.user.settings?.isTeamNotified
      })) ?? [];

    for (const token of tokens) {
      if (token.token && token.isRoom) {
        void this.sendNotification("คุณได้รับการนัดหมายแล้ว", token.token);
      }
    }
  }

  // Room
  async searchUserForDisbanRoomNotify(roomId: string) {
    const roomRes = await this.prisma.roomMember.findMany({
      where: {
        roomId
      },
      select: {
        team: {
          select: {
            members: {
              select: {
                user: {
                  select: {
                    settings: {
                      select: {
                        isMeNotified: true,
                        isRoomNotified: true,
                        isTeamNotified: true
                      }
                    },
                    lineToken: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const member
      = roomRes.map(
        (e) =>
          e.team.members.map((e) => ({
            token: e.user.lineToken,
            isMe: e.user.settings?.isMeNotified,
            isRoom: e.user.settings?.isRoomNotified,
            isTeam: e.user.settings?.isTeamNotified
          })) ?? []
      ) ?? [];

    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId
      }
    });

    for (const tokens of member) {
      for (const token of tokens) {
        if (token.token && token.isRoom) {
          void this.sendNotification(`ห้อง ${room?.name} ถูกยุบแล้ว`, token.token);
        }
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
                    settings: {
                      select: {
                        isMeNotified: true,
                        isRoomNotified: true,
                        isTeamNotified: true
                      }
                    },
                    lineToken: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const tokens
      = roomRes?.hostTeam.members.map((e) => ({
        token: e.user.lineToken,
        isMe: e.user.settings?.isMeNotified,
        isRoom: e.user.settings?.isRoomNotified,
        isTeam: e.user.settings?.isTeamNotified
      })) ?? [];

    for (const token of tokens) {
      if (token.token && token.isRoom) {
        void this.sendNotification("คุณได้รับการร้องขอเข้าห้อง", token.token);
      }
    }
  }

  async searchUserForAcceptNotify(roomId: string, teamId: string) {
    const teamMem = await this.prisma.teamMember.findMany({
      where: {
        teamId
      },
      select: {
        user: {
          select: {
            settings: {
              select: {
                isMeNotified: true,
                isRoomNotified: true,
                isTeamNotified: true
              }
            },
            lineToken: true
          }
        }
      }
    });

    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId
      }
    });

    const tokens
      = teamMem?.map((e) => ({
        token: e.user.lineToken,
        isMe: e.user.settings?.isMeNotified,
        isRoom: e.user.settings?.isRoomNotified,
        isTeam: e.user.settings?.isTeamNotified
      })) ?? [];

    for (const token of tokens) {
      if (token.token && token.isRoom) {
        void this.sendNotification(`คุณได้รับการยืนยันเข้าห้อง ${room?.name}`, token.token);
      }
    }
  }

  async searchUserForLeaveNotify(roomMemberId: string, roomId: string) {
    // team leave
    const teamLeave = await this.prisma.roomMember.findFirst({
      where: {
        id: roomMemberId
      },
      select: {
        team: {
          select: {
            members: {
              select: {
                user: {
                  select: {
                    settings: {
                      select: {
                        isMeNotified: true,
                        isRoomNotified: true,
                        isTeamNotified: true
                      }
                    },
                    lineToken: true
                  }
                }
              }
            },
            name: true
          }
        }
      }
    });

    // other team
    const teamOther = await this.prisma.roomMember.findMany({
      where: {
        roomId,
        NOT: { id: roomMemberId }
      },
      select: {
        team: {
          select: {
            members: {
              select: {
                user: {
                  select: {
                    settings: {
                      select: {
                        isMeNotified: true,
                        isRoomNotified: true,
                        isTeamNotified: true
                      }
                    },
                    lineToken: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // room
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId
      }
    });

    const tokens
      = teamLeave?.team.members.map((e) => ({
        token: e.user.lineToken,
        isMe: e.user.settings?.isMeNotified,
        isRoom: e.user.settings?.isRoomNotified,
        isTeam: e.user.settings?.isTeamNotified
      })) ?? [];
    const tokenOther
      = teamOther?.map(
        (e) =>
          e.team.members.map((e) => ({
            token: e.user.lineToken,
            isMe: e.user.settings?.isMeNotified,
            isRoom: e.user.settings?.isRoomNotified,
            isTeam: e.user.settings?.isTeamNotified
          })) ?? []
      ) ?? [];

    for (const token of tokens) {
      if (token.token && token.isRoom) {
        void this.sendNotification(`คุณได้ออกจากห้อง ${room?.name}`, token.token);
      }
    }
    for (const tokenO of tokenOther) {
      for (const token of tokenO) {
        if (token.token && token.isRoom) {
          void this.sendNotification(
            `ทีม ${teamLeave?.team.name} ได้ออกจากห้อง ${room?.name}`,
            token.token
          );
        }
      }
    }
  }

  // Team
  async searchUserForTeamDisbandNotify(teamId: string) {
    const member = await this.prisma.teamMember.findMany({
      where: {
        teamId
      },
      select: {
        user: {
          select: {
            settings: {
              select: {
                isMeNotified: true,
                isRoomNotified: true,
                isTeamNotified: true
              }
            },
            lineToken: true
          }
        }
      }
    });

    const team = await this.prisma.team.findFirst({
      where: { id: teamId }
    });

    const teamUsers = member.map((e) => e.user);

    if (teamUsers.length > 1) {
      teamUsers.map((e) => {
        if (e.lineToken !== null && e.settings?.isTeamNotified) {
          void this.sendNotification(`ทีม ${team?.name} ถูกยุบแล้ว`, e.lineToken);
        }
      });
    } else {
      if (
        teamUsers !== null
        && teamUsers[0]?.lineToken !== null
        && teamUsers[0]?.settings?.isTeamNotified
      ) {
        void this.sendNotification(`ทีม ${team?.name} ถูกยุบแล้ว`, teamUsers[0].lineToken);
      }
    }
  }

  async searchUserForTeamPendingNotify(teamId: string, userId: string, status?: string) {
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
              settings: {
                select: {
                  isMeNotified: true,
                  isRoomNotified: true,
                  isTeamNotified: true
                }
              },
              lineToken: true
            }
          }
        }
      });

      const managerUsers = member.map((e) => e.user);

      if (managerUsers.length > 1) {
        managerUsers.map((e) => {
          if (e.lineToken !== null && e.settings?.isTeamNotified) {
            void this.sendNotification("คุณได้รับการร้องขอเข้าทีม", e.lineToken);
          }
        });
      } else {
        if (
          managerUsers !== null
          && managerUsers[0]?.lineToken !== null
          && managerUsers[0]?.settings?.isTeamNotified
        ) {
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
        },
        select: {
          settings: {
            select: {
              isMeNotified: true,
              isRoomNotified: true,
              isTeamNotified: true
            }
          },
          lineToken: true
        }
      });

      if (user !== null && user.lineToken !== null && user.settings?.isMeNotified) {
        void this.sendNotification("คุณได้รับการเชิญเข้าทีม", user.lineToken);
      }
    }
  }

  async searchUserForTeamKickedNotify(teamMemberId: string) {
    const team = await this.prisma.teamMember.findFirst({
      where: {
        id: teamMemberId
      },
      select: {
        user: {
          select: {
            settings: {
              select: {
                isMeNotified: true,
                isRoomNotified: true,
                isTeamNotified: true
              }
            },
            lineToken: true
          }
        }
      }
    });

    const tokens = {
      token: team?.user.lineToken,
      isMe: team?.user.settings?.isMeNotified,
      isRoom: team?.user.settings?.isRoomNotified,
      isTeam: team?.user.settings?.isTeamNotified
    };

    if (tokens.token && tokens.isTeam) {
      void this.sendNotification("คุณถูกเตะออกจากทีม", tokens.token);
    }
  }

  async searchUserForTeamAcceptNotify(userId: string, teamId: string, status: string) {
    const team = await this.prisma.team.findFirst({
      where: {
        id: teamId
      }
    });

    if (status === "Accepted") {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId
        },
        select: {
          settings: {
            select: {
              isMeNotified: true,
              isRoomNotified: true,
              isTeamNotified: true
            }
          },
          lineToken: true
        }
      });

      const tokens = {
        token: user?.lineToken,
        isMe: user?.settings?.isMeNotified,
        isRoom: user?.settings?.isRoomNotified,
        isTeam: user?.settings?.isTeamNotified
      };

      if (tokens.token && tokens.isMe) {
        void this.sendNotification(`คุณได้เข้าร่วมทีม ${team?.name}`, tokens.token);
      }
    } else if (status === "Denied") {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId
        },
        select: {
          settings: {
            select: {
              isMeNotified: true,
              isRoomNotified: true,
              isTeamNotified: true
            }
          },
          lineToken: true
        }
      });

      const tokens = {
        token: user?.lineToken,
        isMe: user?.settings?.isMeNotified,
        isRoom: user?.settings?.isRoomNotified,
        isTeam: user?.settings?.isTeamNotified
      };

      if (tokens.token && tokens.isMe) {
        void this.sendNotification(`คุณถูกปฏิเสธจากทีม ${team?.name}`, tokens.token);
      }
    }
  }

  async searchUserForAcceptTeamNotify(userId: string, teamId: string, status: string) {
    const userA = await this.prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if (status === "Accepted") {
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
              settings: {
                select: {
                  isMeNotified: true,
                  isRoomNotified: true,
                  isTeamNotified: true
                }
              },
              lineToken: true
            }
          }
        }
      });

      const managerUsers = member.map((e) => e.user);

      if (managerUsers.length > 1) {
        managerUsers.map((e) => {
          if (e.lineToken !== null && e.settings?.isTeamNotified) {
            void this.sendNotification(`${userA?.displayName} ได้เข้าร่วมทีม`, e.lineToken);
          }
        });
      } else {
        if (
          managerUsers !== null
          && managerUsers[0]?.lineToken !== null
          && managerUsers[0]?.settings?.isTeamNotified
        ) {
          void this.sendNotification(
            `${userA?.displayName} ได้เข้าร่วมทีม`,
            managerUsers[0].lineToken
          );
        }
      }
    } else if (status === "Denied") {
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
              settings: {
                select: {
                  isMeNotified: true,
                  isRoomNotified: true,
                  isTeamNotified: true
                }
              },
              lineToken: true
            }
          }
        }
      });

      const managerUsers = member.map((e) => e.user);

      if (managerUsers.length > 1) {
        managerUsers.map((e) => {
          if (e.lineToken !== null && e.settings?.isTeamNotified) {
            void this.sendNotification(
              `${userA?.displayName} ได้ปฏิเสธการร่วมทีม`,
              e.lineToken
            );
          }
        });
      } else {
        if (
          managerUsers !== null
          && managerUsers[0]?.lineToken !== null
          && managerUsers[0]?.settings?.isTeamNotified
        ) {
          void this.sendNotification(
            `${userA?.displayName} ได้ปฏิเสธการร่วมทีม`,
            managerUsers[0].lineToken
          );
        }
      }
    }
  }

  // chat
  async sendChatMessageNotificationToOthers(chatId: string, serderTeamId?: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId }
    });

    const roomMemberRes = await this.prisma.roomMember.findMany({
      where: {
        roomId: chat?.roomId,
        ...(serderTeamId && { NOT: { teamId: serderTeamId } })
      },
      select: {
        team: {
          select: {
            members: {
              select: {
                user: {
                  select: {
                    settings: {
                      select: {
                        isMeNotified: true,
                        isRoomNotified: true,
                        isTeamNotified: true
                      }
                    },
                    lineToken: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const team = serderTeamId
      ? await this.prisma.team.findFirst({
        where: { id: serderTeamId },
        select: { name: true }
      }) : null;

    const lineTokenOfOtherUsers
      = roomMemberRes.flatMap(
        (e) =>
          e.team.members.map((e) => ({
            token: e.user.lineToken,
            isMe: e.user.settings?.isMeNotified,
            isRoom: e.user.settings?.isRoomNotified,
            isTeam: e.user.settings?.isTeamNotified
          })) ?? []
      ) ?? [];

    for (const token of lineTokenOfOtherUsers) {
      if (token.token && token.isRoom) {
        if (team) {
          void this.sendNotification(`คุณได้รับข้อความใหม่จาก ${team?.name}`, token.token);
        } else {
          void this.sendNotification("คุณได้รับข้อความใหม่จากแอดมิน", token.token);
        }
      }
    }
  }
}
