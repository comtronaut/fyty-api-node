import { Column, Entity, OneToOne } from "typeorm";
import { Room } from "./room.entity";
import { AbstractModel } from "./_model";

@Entity()
export class Chat extends AbstractModel {
  @Column()
  @OneToOne(() => Room, { onUpdate: 'CASCADE' })
  roomId: string;
}