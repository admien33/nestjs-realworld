import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity()
export class File {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(type => ProjectEntity, project => project.files)
  project: ProjectEntity;
}