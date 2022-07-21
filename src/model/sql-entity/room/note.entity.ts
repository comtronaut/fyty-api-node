import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { AbstractModel } from "../_model";
import { Room } from "./room.entity";

@Entity()
export class RoomNote extends AbstractModel {
  
  @IsNotEmpty()
  @ManyToOne(() => Room, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  roomId: string;

  @IsNotEmpty()
  @Column()
  topic: string;

  @Column({ default: "" })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

}