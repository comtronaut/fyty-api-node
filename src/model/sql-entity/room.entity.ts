import { IsNotEmpty } from "class-validator";
import { RoomStatus } from "src/common/_enum";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Game } from "./game.entity";
import { User } from "./user.entity";
import { AbstractModel } from "./_model";

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

  @IsNotEmpty()
  @Column()
  // startAt: Date;
  startAt: string;

  @IsNotEmpty()
  @Column()
  nMatches: number;

  @IsNotEmpty()
  @Column({ default: 1 })
  participantCount: number;

  @IsNotEmpty()
  @ManyToOne(() => Game, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  gameId: string;

  @IsNotEmpty()
  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  hostId: string;

  @IsNotEmpty()
  @Column({ type: "uuid" })
  chatId: string;
  
  @CreateDateColumn()
  createdAt: Date;
}