import { Column, Entity, OneToOne } from "typeorm";
import { Room } from "./room/room.entity";
import { AbstractModel } from "./_model";

// appiontment

@Entity()
export class Appiontment extends AbstractModel {
  @Column()
  @OneToOne(() => Room, { onUpdate: 'CASCADE' })
  roomId: string;
}

// member is here

@Entity()
export class AppiontmentMember extends AbstractModel {
  
}