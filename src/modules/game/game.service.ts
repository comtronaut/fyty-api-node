import { Injectable } from "@nestjs/common";
import { Game } from "@prisma/client";

import { CreateGameDto } from "model/dto/game.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Game[]> {
    return await this.prisma.game.findMany();
  }

  async create(data: CreateGameDto): Promise<Game> {
    return await this.prisma.game.create({ data });
  }

  async update(gameId: string, data: object): Promise<Game> {
    return await this.prisma.game.update({
      where: {
        id: gameId
      },
      data
    });
  }

  async delete(gameId: string): Promise<void> {
    await this.prisma.game.delete({ where: { id: gameId } });
  }
}
