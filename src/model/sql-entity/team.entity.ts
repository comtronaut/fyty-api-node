import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToOne, Unique } from "typeorm";
import { Game } from "./game.entity";
import { AbstractModel } from "./_model";

@Entity()
export class Team extends AbstractModel {
  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column({ default: "" })
  coverUrl: string;

  @IsNotEmpty()
  @Column({ default: "" })
  logoUrl: string;

  @IsNotEmpty()
  @Column()
  memberCount: number;

  @IsNotEmpty()
  @Column({ default: 0 })
  lineupCount: number;

  @IsNotEmpty()
  @Column({ default: "" })
  tier: string;

  @OneToOne(() => Game, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  gameId: string;

  @CreateDateColumn()
  createdAt: Date;
}