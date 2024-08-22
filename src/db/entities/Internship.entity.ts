import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Internship" })
export class Internship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  joined_date: string;

  @Column({ type: "date" })
  completion_date: string;

  @Column({ type: "boolean" })
  isCertified: boolean;

  @Column({ type: "varchar", nullable: false })
  mentor_name: string;
}
