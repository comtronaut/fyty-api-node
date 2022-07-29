import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoomNoteDto, UpdateRoomNoteDto } from "src/model/dto/room.dto";
import { RoomNote } from "src/model/sql-entity/room/note.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomNoteService {
  constructor(
    @InjectRepository(RoomNote) private roomNoteModel: Repository<RoomNote>,
  ) { }

  async create(roomId: string, body: CreateRoomNoteDto){
    try{
        body.roomId = roomId; 
        const note = this.roomNoteModel.create(body);
        await this.roomNoteModel.save(note);
        return note;
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }
  
  async getRoomNotes(roomId: string){
    try{
        return this.roomNoteModel.findBy({ roomId: roomId });
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async update(noteId: string, userId: string, req: UpdateRoomNoteDto){
    try{
        if(await this.validateUser(noteId, userId)){
            return await this.roomNoteModel.update({ id: noteId }, req);
        }
        else{
            return Error("can't update note noteId: " + { noteId }); 
        }
        
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async delete(noteId: string, userId: string){
    try{
        if(await this.validateUser(noteId, userId)){
            const res = await this.roomNoteModel.delete({ id: noteId });
            if(res.affected === 1){
                return HttpStatus.NO_CONTENT;
            }
            else{
                return Error("can't delete note noteId: " + { noteId });
            }
        }
        
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async validateUser(noteId: string, userId: string){ // true if userId is one member on the room Host team
    try{
        return true;
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

}
