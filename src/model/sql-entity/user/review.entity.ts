import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { AbstractModel } from "../_model";

@Entity()
export class Review extends AbstractModel {
  @IsNotEmpty()
  @Column()
  content: string;

  @IsNotEmpty()
  @Column({ default: 5.00 })
  ratingScore: number;

  @IsNotEmpty()
  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  reviewerId: string;

  @IsNotEmpty()
  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  revieweeId: string;

  @CreateDateColumn()
  createdAt: Date;
}