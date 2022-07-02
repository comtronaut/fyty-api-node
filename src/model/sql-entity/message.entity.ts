import { Column, CreateDateColumn, Entity, OneToOne } from "typeorm";
import { Chat } from "./chat.entity";
import { User } from "./user.entity";
import { AbstractModel } from "./_model";

@Entity()
export class Message extends AbstractModel {
  @Column()
  @OneToOne(() => Chat, { onUpdate: 'CASCADE' })
  chatId: string;

  @Column()
  @OneToOne(() => User, { onUpdate: 'CASCADE' })
  senderId: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}