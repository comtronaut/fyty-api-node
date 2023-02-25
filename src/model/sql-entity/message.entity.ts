import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import { Chat } from "./chat.entity";
import { Team } from "./team/team.entity";
import { User } from "./user/user.entity";
import { AbstractModel } from "./_model";

@Entity()
export class Message extends AbstractModel {
  @Column()
  @OneToOne(() => Chat, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  chatId: string;

  @ManyToOne(() => Team, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  @Column({ nullable: true })
  teamId: string;

  @Column()
  @OneToOne(() => User, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  senderId: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
