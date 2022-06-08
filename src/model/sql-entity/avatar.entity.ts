import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractModel } from "./_model";

@Entity()
export class Avatar extends AbstractModel {
  // @IsNotEmpty()
  // @Column({ unique: true, update: false })
  // uuid: string;

  // @IsNotEmpty()
  // @Column()
  // characterName: string;

  // @IsNotEmpty()
  // @Column()
  // rank: string;

  // @IsEmail()
  // @IsNotEmpty()
  // @Column({ unique: true, update: false })
  // gameId: string;

  // @Column({ default: "" })
  // userId: string;

  // @CreateDateColumn()
  // createdAt: Date;
}