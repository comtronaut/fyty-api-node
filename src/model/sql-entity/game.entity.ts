import { IsNotEmpty } from "class-validator";
import { Column, Entity } from "typeorm";
import { AbstractModel } from "./_model";

@Entity()
export class Game extends AbstractModel {
  @IsNotEmpty()
  @Column({ unique: true })
  name: string;

  @IsNotEmpty()
  @Column()
  teamCap: number;

  @IsNotEmpty()
  @Column()
  lineupCap: number;

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