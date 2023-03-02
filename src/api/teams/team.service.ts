import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { MemberRole, Team, User } from "@prisma/client";
import { CreateTeamDto, UpdateTeamDto } from "src/model/dto/team.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  // CRUD
  async create(user: User, req: CreateTeamDto) {
    try {
      const teamCount = await this.prisma.teamMember.count({
        where: { userId: user.id }
      });
      if (teamCount > 0) {
        throw new Error("You already have team");
      }

      req.ownerId = user.id; // set the team's owner
      const team = await this.prisma.team.create({ data: req });

      await this.prisma.teamMember.create({
        data: { teamId: team.id, userId: user.id, role: MemberRole.MANAGER }
      });
      return team;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeam(teamId: string) {
    try {
      return await this.prisma.team.findUniqueOrThrow({
        where: { id: teamId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getMyTeam(userId: string) {
    try {
      const members = await this.prisma.teamMember.findMany({
        where: { userId }
      });
      return await this.prisma.team.findMany({
        where: { id: { in: members.map((e) => e.teamId) } }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getTeamsByGameId(gameId: string) {
    try {
      return await this.prisma.team.findMany({ where: { gameId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllTeam() {
    return await this.prisma.team.findMany();
  }

  async update(ownerId: string, data: UpdateTeamDto): Promise<Team> {
    try {
      await this.prisma.team.update({
        where: { id: data.id },
        data
      });

      const updatedTeam = await this.prisma.team.findFirstOrThrow({
        where: { id: data.id }
      });

      return updatedTeam;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(userId: string, teamId: string) {
    try {
      const member = await this.prisma.teamMember.findFirstOrThrow({
        where: { userId, teamId }
      });
      if (member.role === MemberRole.MANAGER) {
        await this.prisma.teamMember.deleteMany({ where: { teamId } });
      } else {
        throw new Error("Only Manager can delete team");
      }

      return HttpStatus.OK;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
