import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { RoomLineupBoard } from "../../room/Lineup.entity";
import { AbstractModel } from "../../_model";
import { Team } from "../team.entity";
import { MatchHistory } from "./matchHistory.entity";


@Entity()
export class MatchDetail extends AbstractModel {

  @IsNotEmpty()
  @ManyToOne(() => MatchHistory, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  matchHistoryId: string;

  @IsNotEmpty()
  @ManyToOne(() => RoomLineupBoard, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  hostBoardId: string;

  @IsNotEmpty()
  @ManyToOne(() => RoomLineupBoard, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  guestBoardId: string;

  @CreateDateColumn()
  startAt: Date;

  @CreateDateColumn()
  endAt: Date;

  @CreateDateColumn()
  createAt: Date;
}