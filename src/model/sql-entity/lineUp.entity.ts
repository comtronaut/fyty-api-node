import { IsNotEmpty, IsUrl } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { Team } from "./team.entity";
import { AbstractModel } from "./_model";


@Entity()
export class LineUp extends AbstractModel {
    
  @IsNotEmpty()
  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  teamId: string;

  @Column({ unique: true })
  inGameId: string;

  @IsUrl()
  @Column({ default: "" })
  imageUrl: string

}