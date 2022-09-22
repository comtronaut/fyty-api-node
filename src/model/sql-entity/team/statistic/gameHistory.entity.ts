import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { RoomLineupBoard } from "../../room/Lineup.entity";
import { AbstractModel } from "../../_model";
import { Team } from "../team.entity";
import { MatchHistory } from "./matchHistory.entity";


@Entity()
export class GameHistory extends AbstractModel {

  @IsNotEmpty()
  @ManyToOne(() => MatchHistory, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  matchHistoryId: string;

  @Column({ default: 0 })  
  gameNum: number;

  @Column({ default: 0 })  
  gameResult: number;

  @Column({})  
  imgUrl: string;

  @Column({ default: "NONE" })  
  uploader: string;

}