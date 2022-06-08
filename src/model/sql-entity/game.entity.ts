import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractModel } from "./_model";

@Entity()
export class Game extends AbstractModel {
  @IsNotEmpty()
  @Column({ unique: true })
  name: string;

  @IsNotEmpty()
  @Column()
  partyCap: number;

  @IsNotEmpty()
  @Column()
  logoUrl: string;

  @IsNotEmpty()
  @Column()
  coverUrl: string;

  @Column({ default: "" })
  desc: string;

  @Column()
  abbr: string;
}