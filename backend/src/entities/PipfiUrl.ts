import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class PipfiUrl extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text",{nullable: true})
  title: string;

  @Column("text",{nullable: true})
  description: string;

  @Column("text",{nullable: false})
  url: string;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (u) => u.pipfiUrls)
  @JoinColumn({ name: "ownerId" })
  owner: Promise<User>;
}
