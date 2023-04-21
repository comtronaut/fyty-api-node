import { Injectable } from "@nestjs/common";
import { TeamStats, Training, TrainingReport } from "@prisma/client";
import { paginate } from "common/utils/pagination";
import {
  CreateTrainingReportDto,
  UpdateTrainingReportDto
} from "model/dto/training-report.dto";
import { PrismaService } from "prisma/prisma.service";
import { Pagination } from "types/local";

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async getReportsByTeamId(teamId: string): Promise<TrainingReport[]> {
    return await this.prisma.trainingReport.findMany({
      where: { reporterTeamId: teamId }
    });
  }

  async createReport(
    teamId: string,
    data: CreateTrainingReportDto
  ): Promise<TrainingReport> {
    return await this.prisma.trainingReport.create({
      data: {
        ...data,
        reporterTeamId: teamId
      }
    });
  }

  async updateReport(
    reportId: string,
    data: UpdateTrainingReportDto
  ): Promise<TrainingReport> {
    return await this.prisma.trainingReport.update({
      where: { id: reportId },
      data: {
        ...data
      }
    });
  }

  async getTeamStats(teamId: string): Promise<TeamStats | null> {
    return await this.prisma.teamStats.findUniqueOrThrow({
      where: { teamId }
    });
  }

  async getByTeamId(teamId: string, pagination?: Pagination): Promise<Training[]> {
    return await this.prisma.training.findMany({
      where: {
        ...(pagination && paginate(pagination)),
        OR: [{ hostId: teamId }, { guestId: teamId }]
      },
      include: {
        appointment: {
          select: {
            startAt: true,
            endAt: true
          }
        }
      }
    });
  }

  async update(id: string, data: any): Promise<Training> {
    return await this.prisma.training.update({
      where: { id },
      data
    });
  }
}
