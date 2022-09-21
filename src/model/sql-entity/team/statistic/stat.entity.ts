import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { AbstractModel } from "../../_model";
import { Team } from "../team.entity";


@Entity()
export class TeamStatistic extends AbstractModel {

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  teamId: string;

  @Column({ default: 0 })  
  matches: number;

  @Column({ default: 0 })  
  win: number;

  @Column({ default: 0 })  
  lose: number;

  @Column({ default: 0 })  
  tie: number;

  @CreateDateColumn()
  updateAt: Date;
}