import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateTeamPendingDto,
  UpdateTeamPendingDto
} from "src/model/dto/team.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class TeampendingService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamPendingByUser(userId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { userId, status: "pending" }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamInvitationByUser(userId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { userId, status: "invitation" }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamPending(teamId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { teamId, status: "pending" }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamInvitation(teamId: string) {
    try {
      return await this.prisma.teamPending.findMany({
        where: { teamId, status: "invitation" }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createTeamPending(req: CreateTeamPendingDto) {
    return await this.prisma.teamPending.create({ data: req });
  }

  async createTeamInvitation(req: CreateTeamPendingDto) {
    return await this.prisma.teamPending.create({
      data: { ...req, status: "invitation" }
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
