import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import { Room } from "./room/room.entity";
import { Team } from "./team/team.entity";
import { AbstractModel } from "./_model";

// appiontment

@Entity()
export class Appiontment extends AbstractModel {

  @CreateDateColumn()
  startAt: Date;

  @CreateDateColumn()
  endAt: Date;

  @Column({ default: "" })
  status: string;

  @IsNotEmpty()
  @Column({ default: false })
  isDel: boolean;

  @Column()
  @OneToOne(() => Room, { onUpdate: 'CASCADE' })
  roomId: string;
}

// member is here

@Entity()
export class AppiontmentMember extends AbstractModel {

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  teamId: string;

  @IsNotEmpty()
  @ManyToOne(() => Appiontment, { onUpdate: 'CASCADE' })
  @Column({ type: "uuid" })
  appointId: string;
  
}