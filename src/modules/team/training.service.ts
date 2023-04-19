import { Injectable } from "@nestjs/common";
import { TeamStats, Training } from "@prisma/client";
import { paginate } from "src/common/utils/pagination";
import { PrismaService } from "src/prisma/prisma.service";
import { Pagination } from "src/types/local";

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

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
