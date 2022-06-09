import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, Unique } from "typeorm";
import { Team } from "./team.entity";
import { User } from "./user.entity";
import { AbstractModel } from "./_model";

@Entity()
export class TeamMember extends AbstractModel {
  @IsNotEmpty()
  @Column()
  role: string;

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  teamId: string;

  @IsNotEmpty()
  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  userId: string;

  @CreateDateColumn()
  joinedAt: Date;
}