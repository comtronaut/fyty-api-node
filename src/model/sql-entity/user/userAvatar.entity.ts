import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractModel } from "../_model";

@Entity()
export class UserAvatar extends AbstractModel {
  @IsNotEmpty()
  @Column()
  uuid: string;

  @IsNotEmpty()
  @Column({ default: "player 1" })
  characterName: string;

  @IsNotEmpty()
  @Column()
  rank: string;

  @IsNotEmpty()
  @Column({ default: 5 })
  ratingScore: number;

  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true, update: false })
  gameId: string;

  @Column({ default: "" })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}