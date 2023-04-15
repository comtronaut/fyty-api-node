import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomNoteDto, UpdateRoomNoteDto } from "src/model/dto/room.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomNoteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(roomId: string, body: CreateRoomNoteDto) {
    try {
      body.roomId = roomId;
      return await this.prisma.roomNote.create({ data: body });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomNotes(roomId: string) {
    try {
      return this.prisma.roomNote.findMany({ where: { roomId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(noteId: string, userId: string, req: UpdateRoomNoteDto) {
    try {
      if (await this.validateUser(noteId, userId)) {
        return await this.prisma.roomNote.update({
          where: { id: noteId },
          data: req
        });
      } else {
        return Error(`can't update note noteId: ${{ noteId }}`);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(noteId: string, userId: string) {
    try {
      if (await this.validateUser(noteId, userId)) {
        await this.prisma.roomNote.delete({ where: { id: noteId } });
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async validateUser(noteId: string, userId: string) {
    // true if userId is one member on the room Host team
    try {
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
