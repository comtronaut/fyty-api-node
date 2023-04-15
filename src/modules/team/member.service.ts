import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "src/model/dto/team-member";
import { MemberRole, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TeamMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: CreateTeamMemberDto) {
    try {
      const memberCount = await this.prisma.teamMember.count({
        where: { userId: req.userId }
      });
      if (memberCount > 0) {
        throw new Error("This user already joined team");
      }

      return await this.prisma.teamMember.create({
        data: { ...req, role: MemberRole.MEMBER }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(teamMemberId: string, data: UpdateTeamMemberDto) {
    try {
      return await this.prisma.teamMember.update({
        where: { id: teamMemberId },
        data
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getMemberByTeamId(teamId: string) {
    try {
      return await this.prisma.teamMember.findMany({ where: { teamId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async kickMember(teammemberId: string, user: User) {
    try {
      const member = await this.prisma.teamMember.findFirstOrThrow({
        where: { userId: user.id }
      });
      if ([ MemberRole.MANAGER, MemberRole.LEADER ].some((role) => role === member.role)) {
        const res = await this.prisma.teamMember.delete({
          where: { id: teammemberId }
        });
      } else {
        throw new Error("Permission denined");
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async leaveTeam(teamMemberId: string) {
    try {
      const teamMember = await this.prisma.teamMember.findUniqueOrThrow({
        where: { id: teamMemberId }
      });
      const countManager = await this.prisma.teamMember.findMany({
        where: { role: MemberRole.MANAGER, teamId: teamMember.teamId }
      });
      await this.prisma.teamMember.delete({ where: { id: teamMemberId } });

      const countMember = await this.prisma.teamMember.count({
        where: { teamId: teamMember.teamId }
      });

      if (countMember === 0) {
        await this.prisma.team.delete({ where: { id: teamMember.teamId } });
        return HttpStatus.NO_CONTENT;
      }

      if (teamMember.role === MemberRole.MANAGER && countManager.length === 1) {
        await this.prisma.team.delete({ where: { id: teamMember.teamId } });
      }

      return HttpStatus.OK;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
