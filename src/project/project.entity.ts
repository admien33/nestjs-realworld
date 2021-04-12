import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { File } from './file.entity';

@Entity('project')
export class ProjectEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  body: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToOne(type => UserEntity, user => user.projects)
  owner: UserEntity;

  @OneToMany(type => File, file => file.project, {eager: true})
  @JoinColumn()
  files: File[];

  // @Column({default: 0})
  // favoriteCount: number;
}