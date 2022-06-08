import { IsNotEmpty } from "class-validator";
import { Column, Entity } from "typeorm";

import { AbstractModel } from "./_model";

@Entity()
export class PhoneNumber extends AbstractModel {
  @IsNotEmpty()
  @Column({ unique: true, update: false })
  phoneNumber: string;
}
