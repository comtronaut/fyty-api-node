import { Injectable } from "@nestjs/common";
import { PendingStatus } from "@prisma/client";
import { CreateTeamPendingDto, UpdateTeamPendingDto } from "src/model/dto/team-pending";
import { NotifyService } from "src/modules/notification/lineNotify.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TeamPendingService {
  constructor(private readonly prisma: PrismaService, private readonly lineNotify: NotifyService) {}

  async getTeamPendingByUser(userId: string) {
    return await this.prisma.teamPending.findMany({
      where: { userId, status: PendingStatus.INCOMING }
    });
  }

  async getTeamInvitationByUser(userId: string) {
    return await this.prisma.teamPending.findMany({
      where: { userId, status: PendingStatus.OUTGOING }
    });
  }

  async getTeamPending(teamId: string) {
    return await this.prisma.teamPending.findMany({
      where: { teamId, status: PendingStatus.INCOMING }
    });
  }

  async getTeamInvitation(teamId: string) {
    return await this.prisma.teamPending.findMany({
      where: { teamId, status: PendingStatus.OUTGOING }
    });
  }

  async createTeamPending(data: CreateTeamPendingDto) {
    const out = await this.prisma.teamPending.create({ data });

    void this.lineNotify.searchUserForTeamPendingNotify(
      data.teamId,
      data.userId,
      PendingStatus.INCOMING
    );

    return out;
  }

  async createTeamInvitation(data: CreateTeamPendingDto) {
    const out = await this.prisma.teamPending.create({
      data: { ...data, status: PendingStatus.OUTGOING }
    });

    void this.lineNotify.searchUserForTeamPendingNotify(
      data.teamId,
      data.userId,
      PendingStatus.OUTGOING
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
    await this.prisma.teamPending.delete({
      where: { id: teamPendingId }
    });
  }
}
