import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";
import { AbstractModel } from "../_model";
import { Team } from "./team.entity";

@Entity()
export class TeamPending extends AbstractModel {

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  teamId: string;

  @IsNotEmpty()
  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  userId: string;

  @IsNotEmpty()
  @Column({ default: "pending" })
  status: string;

  @CreateDateColumn()
  createAt: Date;
}