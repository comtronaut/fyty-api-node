import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateGameDto } from "src/model/dto/game.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGameDto) {
    try {
      return await this.prisma.game.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAll() {
    return await this.prisma.game.findMany();
  }

  async update(gameId: string, req: object) {
    try {
      const updateRes = await this.prisma.game.update({
        where: {
          id: gameId
        },
        data: req
      });

      return await this.prisma.game.findUniqueOrThrow({
        where: { id: gameId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(gameId: string) {
    try {
      const res = await this.prisma.game.delete({ where: { id: gameId } });
      return;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
