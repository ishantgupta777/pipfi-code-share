import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PipfiUrl } from "./PipfiUrl";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: true })
  name: string;

  @Column("text", { nullable: true })
  githubUserName: string;

  @Column("text", { unique: true })
  githubId: string;

  @Column("text", { nullable: true })
  avatarUrl: string;

  @Column("text", { nullable: true })
  email: string;

  @OneToMany(() => PipfiUrl, (t) => t.owner)
  pipfiUrls: Promise<PipfiUrl[]>;
}
