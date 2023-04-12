import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import env from "src/common/env.config";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class NotifyService {
  constructor(private readonly prisma: PrismaService) {}

  async sendNotification(message: string, token: string): Promise<void> {
    const url = "https://notify-api.line.me/api/notify";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.postForm(url, { message }, { headers });
    } catch (error) {
      throw new BadRequestException("Failed to send notification");
    }
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
    const response = await axios.postForm(
      "https://notify-bot.line.me/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: env.LINE_NOTIFY_REDIRECT_URI,
        client_id: env.LINE_NOTIFY_CLIENT_ID,
        client_secret: env.LINE_NOTIFY_CLIENT_SECRET
      }
    );

    return response.data;
  }

  async callback(code: string, state: string): Promise<void> {
    try {
      // get lineNotify token
      const token = await this.authenticate(code);

      // update line_token in user
      await this.prisma.user.update({
        where: {
          id: state
        },
        data: {
          lineToken: token.access_token
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchUserForAppointmentNotify(memberIds: string[]) {
    const member = await this.prisma.teamMember.findMany({
      where: {
        teamId: {
          in: memberIds
        }
      }
    });

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: member.flatMap((e) => (e.userId ? [ e.userId ] : []))
        }
      }
    });

    users.map((e) => {
      if (e.lineToken !== null) {
        void this.sendNotification("คุณได้รับการนัดหมายแล้ว", e.lineToken);
      }
    });
  }

  async searchUserForRequestNotify(roomId: string) {
    const team = await this.prisma.room.findFirst({
      where: {
        id: roomId
      }
    });

    const member = await this.prisma.teamMember.findMany({
      where: {
        teamId: team?.hostId
      }
    });

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: member.flatMap((e) => (e.userId ? [ e.userId ] : []))
        }
      }
    });

    users.map((e) => {
      if (e.lineToken !== null) {
        void this.sendNotification("คุณได้รับการร้องขอเข้าห้อง", e.lineToken);
      }
    });
  }

  async searchUserForTeamPendingNotify(
    teamId: string,
    userId: string,
    status: string
  ) {
    if (status === "pending") {
      const member = await this.prisma.teamMember.findMany({
        where: {
          teamId
        }
      });

      const manager = await this.prisma.user.findMany({
        where: {
          id: {
            in: member.flatMap((e) =>
              e.role === MemberRole.MANAGER ? [ e.userId ] : []
            )
          }
        }
      });

      if (manager.length > 1) {
        manager.map((e) => {
          if (e.lineToken !== null) {
            void this.sendNotification(
              "คุณได้รับการร้องขอเข้าทีม",
              e.lineToken
            );
          }
        });
      } else {
        if (manager !== null && manager[0].lineToken !== null) {
          void this.sendNotification(
            "คุณได้รับการร้องขอเข้าทีม",
            manager[0].lineToken
          );
        }
      }
    } else if (status === "invitation") {
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

    const roomParticipant = await this.prisma.roomParticipant.findMany({
      where: {
        roomId: chat?.roomId
      }
    });

    const teams = await this.prisma.team.findMany({
      where: {
        id: {
          in: roomParticipant.flatMap((e) => (e.teamId ? [ e.teamId ] : []))
        },
        NOT: {
          id: teamId
        }
      }
    });

    const member = await this.prisma.teamMember.findMany({
      where: {
        teamId: {
          in: teams.flatMap((e) => (e.id ? [ e.id ] : []))
        }
      }
    });

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: member.flatMap((e) => (e.userId ? [ e.userId ] : []))
        }
      }
    });

    users.map((e) => {
      if (e.lineToken !== null) {
        void this.sendNotification("คุณได้รับข้อความใหม่", e.lineToken);
      }
    });
  }
}
