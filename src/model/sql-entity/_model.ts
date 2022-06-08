import { PrimaryGeneratedColumn } from "typeorm";

export abstract class AbstractModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
