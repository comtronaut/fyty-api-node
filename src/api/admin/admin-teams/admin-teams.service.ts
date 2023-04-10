import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateTeamDto } from "src/model/dto/team.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class AdminTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTeams() {
    try {
      return await this.prisma.team.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTeam(teamId: string) {
    try {
      return await this.prisma.team.findUniqueOrThrow({
        where: {
          id: teamId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateTeamDetail(teamId: string, payload: UpdateTeamDto) {
    try {
      return await this.prisma.team.update({
        where: { id: teamId },
        data: payload
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteTeam(teamId: string) {
    try {
      return await this.prisma.team.delete({
        where: {
          id: teamId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
