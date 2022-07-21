import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Room } from "./room.entity";
import { Team } from "../team/team.entity";

import { AbstractModel } from "../_model";
import { RoomLineupBoard } from "./Lineup.entity";

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

  @IsNotEmpty()
  @ManyToOne(() => RoomLineupBoard, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  roomLineUpBoardId: string;

  @CreateDateColumn()
  joinedAt: Date;

}