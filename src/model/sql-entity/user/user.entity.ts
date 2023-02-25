import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractModel } from "../_model";

@Entity()
export class User extends AbstractModel {
  @IsNotEmpty()
  @Column({ unique: true })
  username: string;

  @IsNotEmpty()
  @Min(6)
  @Column()
  password: string;

  @IsNotEmpty()
  @Column()
  displayName: string;

  @Column({ default: "" })
  description: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  portraitUrl: string;

  @Column({ default: "" })
  coverUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
