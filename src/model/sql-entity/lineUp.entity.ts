import { IsNotEmpty, IsUrl } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { Team } from "./team.entity";
import { AbstractModel } from "./_model";


@Entity()
export class LineUp extends AbstractModel {
    
  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  teamId: string;

  @IsNotEmpty()
  @Column({ unique: true })
  inGameId: string;

  @IsNotEmpty()
  @IsUrl()
  @Column()
  imgUrl: string

}