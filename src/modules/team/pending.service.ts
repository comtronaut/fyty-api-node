import { Injectable } from "@nestjs/common";
import { PendingStatus } from "@prisma/client";
import { CreateTeamPendingDto, UpdateTeamPendingDto } from "model/dto/team-pending.dto";
import { NotifyService } from "modules/notification/lineNotify.service";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TeamPendingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: NotifyService
  ) {}

  async getTeamPendingByUser(userId: string, status?: PendingStatus) {
    return await this.prisma.teamPending.findMany({
      where: {
        userId,
        ...(status && { status })
      }
    });
  }

  async getTeamPending(teamId: string, status?: PendingStatus) {
    return await this.prisma.teamPending.findMany({
      where: {
        teamId,
        ...(status && { status })
      }
    });
  }

  async createTeamPending(data: CreateTeamPendingDto) {
    const out = await this.prisma.teamPending.create({ data });

    void this.lineNotify.searchUserForTeamPendingNotify(
      data.teamId,
      data.userId,
      data.status
    );

    return out;
  }

  async updateStatus(teampendingId: string, data: UpdateTeamPendingDto) {
    return await this.prisma.teamPending.update({
      where: { id: teampendingId },
      data
    });
  }

  async discard(teamPendingId: string) {
    const data = await this.prisma.teamPending.findFirst({
      where: { id: teamPendingId }
    });

    // notify
    if (data) {
      if (data.status == "INCOMING")
      {this.lineNotify.searchUserForTeamAcceptNotify(data?.userId, data?.teamId, "Denied");}
      if (data.status == "OUTGOING")
      {this.lineNotify.searchUserForAcceptTeamNotify(data?.userId, data?.teamId, "Denied");}
    }

    await this.prisma.teamPending.delete({
      where: { id: teamPendingId }
    });
  }
}
