import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { AbstractModel } from "../../_model";
import { Team } from "../team.entity";


@Entity()
export class MatchHistory extends AbstractModel {

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  hostId: string;

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  guestId: string;

  @Column({ default: 0 })  
  hostWin: number;

  @Column({ default: 0 })  
  hostlose: number;

  @Column({ default: "tie" })  
  result: string;
}