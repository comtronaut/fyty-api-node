import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { NotifyService } from "src/modules/notification/lineNotify.service";
import { CreateTeamPendingDto, UpdateTeamPendingDto } from "src/model/dto/team-pending";
import { PrismaService } from "src/prisma/prisma.service";
import { PendingStatus } from "@prisma/client";

@Injectable()
export class TeampendingService {
  constructor(private readonly prisma: PrismaService, private readonly lineNotify: NotifyService) {}

  async getTeamPendingByUser(userId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { userId, status: PendingStatus.INCOMING }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamInvitationByUser(userId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { userId, status: PendingStatus.OUTGOING }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamPending(teamId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { teamId, status: PendingStatus.INCOMING }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamInvitation(teamId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { teamId, status: PendingStatus.OUTGOING }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createTeamPending(req: CreateTeamPendingDto) {
    // send line notify
    void this.lineNotify.searchUserForTeamPendingNotify(
      req.teamId,
      req.userId,
      PendingStatus.INCOMING
    );
    return await this.prisma.teamPending.create({ data: req });
  }

  async createTeamInvitation(req: CreateTeamPendingDto) {
    // send line notify
    void this.lineNotify.searchUserForTeamPendingNotify(
      req.teamId,
      req.userId,
      PendingStatus.OUTGOING
    );
    return await this.prisma.teamPending.create({
      data: { ...req, status: PendingStatus.OUTGOING }
    });
  }

  async updateStatus(teampendingId: string, req: UpdateTeamPendingDto) {
    try {
      const updateRes = await this.prisma.teamPending.update({
        where: { id: teampendingId },
        data: req
      });

      return await this.prisma.teamPending.findFirstOrThrow({
        where: { id: teampendingId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async discard(teamPendingId: string) {
    try {
      const res = await this.prisma.teamPending.delete({
        where: { id: teamPendingId }
      });

      return HttpStatus.OK;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
