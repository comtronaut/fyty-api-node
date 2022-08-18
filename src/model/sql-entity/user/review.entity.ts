import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { AbstractModel } from "../_model";
import { Game } from "../game.entity";

@Entity()
export class Review extends AbstractModel {
  @IsNotEmpty()
  @Column()
  content: string;

  @IsNotEmpty()
  @Column({ type: "decimal", precision:2, default: 0.00 })
  ratingScore: number;

  @IsNotEmpty()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  reviewerId: string;

  @IsNotEmpty()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  revieweeId: string;

  @IsNotEmpty()
  @ManyToOne(() => Game, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  gameId: string;

  @CreateDateColumn()
  createdAt: Date;
}