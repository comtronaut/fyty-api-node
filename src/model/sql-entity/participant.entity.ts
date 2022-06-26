import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Room } from "./room.entity";
import { Team } from "./team.entity";
import { AbstractModel } from "./_model";

@Entity()
export class RoomParticipant extends AbstractModel {
  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE' }) // joined team
  @Column({ type: "uuid" })
  teamId: string;

  @IsNotEmpty()
  @ManyToOne(() => Room, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  roomId: string;

  @CreateDateColumn()
  joinedAt: Date;
}