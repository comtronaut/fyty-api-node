import { IsNotEmpty, IsUrl } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Team } from "./team.entity";
import { AbstractModel } from "../_model";
import { UserAvatar } from "../user/userAvatar.entity";

@Entity()
export class TeamLineUp extends AbstractModel {
  @IsNotEmpty()
  @ManyToOne(() => Team, { onDelete: "CASCADE" })
  @Column({ type: "uuid" })
  teamId: string;

  @OneToOne(() => UserAvatar)
  @Column({ type: "uuid", nullable: true })
  avatarId: string;

  @Column({ nullable: true })
  inGameId: string;

  @IsNotEmpty()
  @Column({ default: false })
  isDefault: boolean;

  @IsUrl()
  @Column({ default: "" })
  profileUrl: string;

  @IsUrl()
  @Column({ default: "" })
  imageUrl: string;

  @IsNotEmpty()
  @Column({ default: "new player" })
  name: string;

  @Column({ default: "" })
  note: string;
}
