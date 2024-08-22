import * as bcrypt from "bcryptjs";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  username: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @ManyToOne(() => Role)
  @JoinColumn()
  role: Role;

  @Column({ type: "boolean", default: false }) // boolean soft delete flag
  deleted: boolean;

  @Column({ type: "boolean", default: false }) // boolean user verified flag
  verified: boolean;

  // method to hash the password before saving
  async setPassword(password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  // method to compare passwords
  async checkPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  // method to soft delete the user
  // async softDelete() {
  //   this.deleted = true;
  //   await this.save();
  // }

  // method to restore the user
  // async restore() {
  //   this.deleted = false;
  //   await this.save();
  // }
}
