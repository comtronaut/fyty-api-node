import { BadRequestException, Injectable } from "@nestjs/common";
import { MemberRole, Team, User } from "@prisma/client";
import { CreateTeamDto, UpdateTeamDto } from "src/model/dto/team.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, req: CreateTeamDto) {
    try {
      const teamCount = await this.prisma.teamMember.count({
        where: { userId: user.id }
      });

      if (teamCount > 0) {
        throw new Error("You already have team");
      }

      const team = await this.prisma.team.create({
        data: {
          ...req,
          members: {
            create: {
              userId: user.id,
              role: MemberRole.MANAGER
            }
          }
        }
      });
      return team;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getById(teamId: string) {
    return await this.prisma.team.findUniqueOrThrow({
      where: { id: teamId }
    });
  }

  async getUserTeams(userId: string) {
    const memberRes = await this.prisma.teamMember.findMany({
      where: { userId },
      select: {
        team: true
      }
    });

    return memberRes.map((e) => e.team);
  }

  async getGameId(gameId: string) {
    return await this.prisma.team.findMany({ where: { gameId } });
  }

  async getAll() {
    return await this.prisma.team.findMany();
  }

  async update(payload: UpdateTeamDto): Promise<Team> {
    return await this.prisma.team.update({
      where: { id: payload.id },
      data: payload
    });
  }

  async delete(userId: string, teamId: string) {
    const member = await this.prisma.teamMember.findFirstOrThrow({
      where: { userId, teamId }
    });

    if (member.role === MemberRole.MANAGER) {
      await this.prisma.teamMember.deleteMany({ where: { teamId } });
    } else {
      throw new Error("Only Manager can delete team");
    }
  }

  async deleteByAdmin(teamId: string) {
    await this.prisma.teamMember.deleteMany({ where: { teamId } });
  }
}
