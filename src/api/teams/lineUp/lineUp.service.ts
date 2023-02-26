import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateLineUpDto, UpdateLineUpDto } from "src/model/dto/lineUp.dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class LineUpService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLineUpDto) {
    try {
      return await this.prisma.teamLineUp.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(user: User, lineUpId: string, req: UpdateLineUpDto) {
    try {
      const teamMember = await this.prisma.teamMember.findFirstOrThrow({
        where: { userId: user.id }
      });

      if (req.isDefault === "true") {
        req.isDefault = true;
      } else if (req.isDefault === "false") {
        req.isDefault = false;
      }

      if (teamMember.role === "Manager" || teamMember.role === "Leader") {
        // cheack if you are Manager
        await this.prisma.teamLineUp.update({
          where: { id: lineUpId },
          data: req
        });
        return req;
      } else {
        throw new Error("Only team's Manager can edit lineUps");
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineUps(teamId?: string) {
    try {
      return teamId
        ? await this.prisma.teamLineUp.findMany({ where: { teamId } })
        : await this.prisma.teamLineUp.findMany({ where: { teamId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineUpById(lineUpId: string) {
    try {
      return await this.prisma.teamLineUp.findUniqueOrThrow({
        where: { id: lineUpId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineUpsByParti(participantId: string) {
    try {
      const parti = await this.prisma.roomParticipant.findUniqueOrThrow({
        where: { id: participantId }
      });
      const lineUpBoard = await this.prisma.roomLineupBoard.findUniqueOrThrow({
        where: { id: parti.roomLineUpBoardId }
      });
      return await this.getLineUpsByBoard(lineUpBoard.id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineUpsByBoard(roomLineUpBoardId: string) {
    try {
      const roomLineUps = await this.prisma.roomLineup.findMany({
        where: { roomLineUpBoardId }
      });
      return await this.prisma.teamLineUp.findMany({
        where: {
          id: {
            in: roomLineUps.flatMap((e) =>
              e.teamLineUpId ? [ e.teamLineUpId ] : []
            )
          }
        }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteAllLineUps(userId: string, teamId: string) {
    try {
      const member = await this.prisma.teamMember.findFirstOrThrow({
        where: { teamId, userId }
      });
      if (member.role === "Manager" || member.id === "Leader") {
        await this.prisma.teamLineUp.deleteMany({ where: { teamId } });
        return HttpStatus.NO_CONTENT;
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteById(userId: string, lineupId: string) {
    try {
      const targetedLineUp = await this.prisma.teamLineUp.findUniqueOrThrow({
        where: { id: lineupId }
      });
      const team = await this.prisma.team.findUniqueOrThrow({
        where: { id: targetedLineUp.teamId }
      });
      const member = await this.prisma.teamMember.findFirstOrThrow({
        where: { userId, teamId: team.id }
      });

      if (member.role === "Manager" || member.role === "Leader") {
        await this.prisma.teamLineUp.delete({ where: { id: lineupId } });
        return HttpStatus.NO_CONTENT;
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
