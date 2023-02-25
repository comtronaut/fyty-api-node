import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { TeamLineUp } from "../team/lineUp.entity";
import { AbstractModel } from "../_model";

// room line up

@Entity()
export class RoomLineup extends AbstractModel {
  @IsNotEmpty()
  @ManyToOne(() => TeamLineUp, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @Column({ type: "uuid", nullable: true })
  teamLineUpId: string | null;

  @IsNotEmpty()
  @ManyToOne(() => RoomLineupBoard, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  @Column({ type: "uuid" })
  roomLineUpBoardId: string;
}

// Line up board is here

@Entity()
export class RoomLineupBoard extends AbstractModel {}
