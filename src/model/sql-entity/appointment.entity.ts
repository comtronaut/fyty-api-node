import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import { Room } from "./room/room.entity";
import { Team } from "./team/team.entity";
import { AbstractModel } from "./_model";

// appiontment

@Entity()
export class Appointment extends AbstractModel {

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
  @OneToOne(() => Room, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  roomId: string;
}

// member is here

@Entity()
export class AppointmentMember extends AbstractModel {

  @IsNotEmpty()
  @ManyToOne(() => Team, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid" })
  teamId: string;

  @ManyToOne(() => Appointment, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Column({ type: "uuid", nullable: true })
  appointId: string;
  
}