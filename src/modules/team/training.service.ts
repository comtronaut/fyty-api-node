import { Injectable } from "@nestjs/common";
import { TeamStats, Training } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamStats(teamId: string): Promise<TeamStats | null> {
    const { stats } = await this.prisma.team.findUniqueOrThrow({
      where: { id: teamId },
      select: { stats: true }
    });

    return stats;
  }

  async getByTeamId(teamId: string): Promise<Training[]> {
    const teamRes = await this.prisma.team.findUniqueOrThrow({
      where: { id: teamId },
      select: {
        appointmentMembers: {
          select: {
            appointment: {
              select: {
                training: true
              }
            }
          }
        }
      }
    });

    return teamRes.appointmentMembers
      .map((e) => e.appointment)
      .flatMap((e) => (e.training ? [ e.training ] : []));
  }

  async update(id: string, data: any): Promise<Training> {
    return await this.prisma.training.update({
      where: { id },
      data
    });
  }
}
