import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import { Game } from "../game.entity";
import { User } from "../user/user.entity";
import { AbstractModel } from "../_model";

@Entity()
export class UserAvatar extends AbstractModel {
  @IsNotEmpty()
  @Column()
  ingameId: string;

  @IsNotEmpty()
  @Column({ default: "player 1" })
  characterName: string;

  @IsNotEmpty()
  @Column()
  rank: string;

  @IsNotEmpty()
  @Column({ default: 5 })
  ratingScore: number;

  @IsNotEmpty()
  @ManyToOne(() => Game, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  gameId: string;

  @IsNotEmpty()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Column({ type: "uuid"})
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}


