import { Injectable } from "@nestjs/common";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class NotifyService {
  constructor(private readonly prisma: PrismaService) {}

  async sendNotification(message: string, token: string): Promise<void> {
    const url = "https://notify-api.line.me/api/notify";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // use lineNotify API
      await axios.postForm(url, { message }, { headers });
      console.log("success");
    } catch (error) {
      console.error(error);
      console.log("error");
      throw new Error("Failed to send notification");
    }
  }

  async getLine(
    res: { redirect: (arg0: string) => void },
    userId: string
  ): Promise<void> {
    const clientId = "pyQHEFXVPWHQhVXee6dFEv";
    // callback url
    const callbackUri = "https://www.fyty-esport.com/line-notify-callback";

    const queryParams = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: callbackUri,
      scope: "notify",
      state: userId
    });

    const authorizeUrl = `https://notify-bot.line.me/oauth/authorize?${queryParams.toString()}`;
    res.redirect(authorizeUrl);
  }

  async authenticate(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ) {
    // use lineNotify API
    const response = await axios.postForm(
      "https://notify-bot.line.me/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      }
    );

    return response.data;
  }

  async callback(code: string, state: string) {
    // callback url
    const redirectUri = "https://www.fyty-esport.com/line-notify-callback";
    const CLIENT_ID = "pyQHEFXVPWHQhVXee6dFEv";
    const CLIENT_SECRET = "BWH2rJcYWeTco1A7c76I7tlYfPmyeDs8htlEiyjQzrf";

    try {
      // get lineNotify token
      const token = await this.authenticate(
        code,
        CLIENT_ID,
        CLIENT_SECRET,
        redirectUri
      );

      // update line_token in user
      const res = await this.prisma.user.update({
        where: {
          id: state
        },
        data: {
          lineToken: token.access_token
        }
      });

      return res;
    } catch (error) {
      console.error("Error occurred while authenticating:", error);
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
        this.sendNotification("คุณได้รับการนัดหมายแล้ว", e.lineToken);
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
        this.sendNotification("คุณได้รับการร้องขอเข้าห้อง", e.lineToken);
      }
    });
  }

  async searchUserForTeamPendingNotify(
    teamId: string,
    userId: string,
    status: string
  ) {
    if (status == "pending") {
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
            this.sendNotification("คุณได้รับการร้องขอเข้าทีม", e.lineToken);
          }
        });
      } else {
        if (manager !== null && manager[0].lineToken !== null) {
          this.sendNotification(
            "คุณได้รับการร้องขอเข้าทีม",
            manager[0].lineToken
          );
        }
      }
    } else if (status == "invitation") {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId
        }
      });

      if (user !== null && user.lineToken !== null) {
        this.sendNotification("คุณได้รับการเชิญเข้าทีม", user.lineToken);
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
        this.sendNotification("คุณได้รับข้อความใหม่", e.lineToken);
      }
    });
  }
}
