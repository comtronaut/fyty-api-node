import { Injectable } from "@nestjs/common";
import { CreateGameDto } from "src/model/dto/game.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.game.findMany();
  }

  async create(data: CreateGameDto) {
    return await this.prisma.game.create({ data });
  }

  async update(gameId: string, data: object) {
    return await this.prisma.game.update({
      where: {
        id: gameId
      },
      data
    });
  }

  async delete(gameId: string) {
    return await this.prisma.game.delete({ where: { id: gameId } });
  }
}
