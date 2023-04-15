import { Prisma } from ".prisma/client";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: Prisma.ChatCreateInput) {
    try {
      return await this.prisma.chat.create({ data: req });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getChatWithMessages(chatId: string) {
    try {
      return await this.prisma.chat.findFirstOrThrow({
        where: { id: chatId },
        include: { messages: true }
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async getChatWithMessagesByRoomId(roomId: string) {
    try {
      return await this.prisma.chat.findFirstOrThrow({
        where: { id: roomId },
        include: { messages: true }
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  // async update(gameId: string, req: object) {
  //   try {
  //     const updateRes = await this.gameModel.update(gameId, req);

  //     if(updateRes.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT);
  //     }

  //     return await this.gameModel.findOneOrFail({ where: { id: gameId }});
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async delete(gameId: string) {
  //   try {
  //     const res = await this.gameModel.delete(gameId);
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
