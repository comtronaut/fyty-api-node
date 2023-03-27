import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateGameDto } from "src/model/dto/game.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.game.findMany();
  }

}
