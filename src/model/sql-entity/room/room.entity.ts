import { IsNotEmpty } from "class-validator";
import { RoomStatus } from "src/common/_enum";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Game } from "../game.entity";
import { Team } from "../team/team.entity";
import { User } from "../user/user.entity";
import { AbstractModel } from "../_model";

@Entity()
export class Room extends AbstractModel {

  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column({ default: RoomStatus.AVAILABLE })
  status: string;

  @IsNotEmpty()
  @Column({ default: "" })
  option: string;

  @CreateDateColumn()
  startAt: Date;

  @CreateDateColumn()
  endAt: Date;

  @IsNotEmpty()
  @Column({ default: 1 })
  teamCount: number;

  @IsNotEmpty()
  @ManyToOne(() => Game, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  gameId: string;

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  hostId: string;
        
  @CreateDateColumn()
  createdAt: Date;

}