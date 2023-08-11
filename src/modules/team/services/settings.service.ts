import { Injectable } from "@nestjs/common";
import { TeamSettings } from "@prisma/client";

import { UpdateLineupDto } from "model/dto/team-lineup.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TeamSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByTeamId(teamId: string): Promise<TeamSettings> {
    return await this.prisma.teamSettings.findUniqueOrThrow({ where: { teamId } });
  }

  async update(data: UpdateLineupDto): Promise<TeamSettings> {
    return await this.prisma.teamSettings.update({
      where: { teamId: data.teamId },
      data
    });
  }
}
