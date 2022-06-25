import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, Unique } from "typeorm";
import { Game } from "./game.entity";
import { User } from "./user.entity";
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
  @Column({ default: 0 })
  lineupCount: number;

  @Column({ default: "" })
  tier: string;

  @OneToOne(() => Game, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  gameId: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;
}