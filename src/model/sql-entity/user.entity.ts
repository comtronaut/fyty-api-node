import { IsNotEmpty, IsEmail, Min } from "class-validator";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractModel } from "./_model";

@Entity()
export class User extends AbstractModel {
  @IsNotEmpty()
  @Column({ unique: true, update: false })
  username: string;

  @IsNotEmpty()
  @Min(6)
  @Column()
  password: string;

  @IsNotEmpty()
  @Column()
  displayName: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true, update: false })
  email: string;

  @Column({ default: "" })
  bio: string;

  @Column("decimal", { precision: 5, scale: 2 , default: 5.00})
  ratingScore: number;

  @Column({ default: "" })
  profileImageUrl: string;

  @Column({ default: "" })
  coverUrl: string;

//   prefId: string;
  
//   availableFeatureId: string;

//   premiumId: string;

//   inventoryId: string;

  @CreateDateColumn()
  createdAt: Date;
}