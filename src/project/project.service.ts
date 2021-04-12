import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { File } from './file.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { CreateProjectDto } from './dto';

import {ProjectRO, ProjectsRO, FilesRO} from './project.interface';
const slug = require('slug');

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    // @InjectRepository(FollowsEntity)
    // private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  async findAll(query): Promise<ProjectsRO> {

    const qb = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner');

    qb.where("1 = 1");

    if ('tag' in query) {
      qb.andWhere("project.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    if ('owner' in query) {
      const owner = await this.userRepository.findOne({username: query.owner});
      qb.andWhere("project.ownerId = :id", { id: owner.id });
    }

    // if ('favorited' in query) {
    //   const owner = await this.userRepository.findOne({username: query.favorited});
    //   const ids = owner.favorites.map(el => el.id);
    //   qb.andWhere("project.ownerId IN (:ids)", { ids });
    // }

    qb.orderBy('project.created', 'DESC');

    const projectsCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const projects = await qb.getMany();

    return {projects, projectsCount};
  }

  // async findFeed(userId: number, query): Promise<ProjectsRO> {
  //   const _follows = await this.followsRepository.find( {followerId: userId});

  //   if (!(Array.isArray(_follows) && _follows.length > 0)) {
  //     return {projects: [], projectsCount: 0};
  //   }

  //   const ids = _follows.map(el => el.followingId);

  //   const qb = await getRepository(ProjectEntity)
  //     .createQueryBuilder('project')
  //     .where('project.ownerId IN (:ids)', { ids });

  //   qb.orderBy('project.created', 'DESC');

  //   const projectsCount = await qb.getCount();

  //   if ('limit' in query) {
  //     qb.limit(query.limit);
  //   }

  //   if ('offset' in query) {
  //     qb.offset(query.offset);
  //   }

  //   const projects = await qb.getMany();

  //   return {projects, projectsCount};
  // }

  async findOne(where): Promise<ProjectRO> {
    const project = await this.projectRepository.findOne(where);
    return {project};
  }

  async addFile(slug: string, fileData): Promise<ProjectRO> {
    let project = await this.projectRepository.findOne({slug});

    const file = new File();
    file.body = fileData.body;

    project.files.push(file);

    await this.fileRepository.save(file);
    project = await this.projectRepository.save(project);
    return {project}
  }

  async deleteFile(slug: string, id: string): Promise<ProjectRO> {
    let project = await this.projectRepository.findOne({slug});

    const file = await this.fileRepository.findOne(id);
    const deleteIndex = project.files.findIndex(_file => _file.id === file.id);

    if (deleteIndex >= 0) {
      const deleteFiles = project.files.splice(deleteIndex, 1);
      await this.fileRepository.delete(deleteFiles[0].id);
      project =  await this.projectRepository.save(project);
      return {project};
    } else {
      return {project};
    }

  }

  // async favorite(id: number, slug: string): Promise<ProjectRO> {
  //   let project = await this.projectRepository.findOne({slug});
  //   const user = await this.userRepository.findOne(id);

  //   const isNewFavorite = user.favorites.findIndex(_project => _project.id === project.id) < 0;
  //   if (isNewFavorite) {
  //     user.favorites.push(project);
  //     project.favoriteCount++;

  //     await this.userRepository.save(user);
  //     project = await this.projectRepository.save(project);
  //   }

  //   return {project};
  // }

  // async unFavorite(id: number, slug: string): Promise<ProjectRO> {
  //   let project = await this.projectRepository.findOne({slug});
  //   const user = await this.userRepository.findOne(id);

  //   const deleteIndex = user.favorites.findIndex(_project => _project.id === project.id);

  //   if (deleteIndex >= 0) {

  //     user.favorites.splice(deleteIndex, 1);
  //     project.favoriteCount--;

  //     await this.userRepository.save(user);
  //     project = await this.projectRepository.save(project);
  //   }

  //   return {project};
  // }

  async findFiles(slug: string): Promise<FilesRO> {
    const project = await this.projectRepository.findOne({slug});
    return {files: project.files};
  }

  async create(userId: number, projectData: CreateProjectDto): Promise<ProjectEntity> {

    let project = new ProjectEntity();
    project.title = projectData.title;
    project.description = projectData.description;
    project.slug = this.slugify(projectData.title);
    // project.tagList = projectData.tagList || [];
    project.files = [];

    const newProject = await this.projectRepository.save(project);

    const owner = await this.userRepository.findOne({ where: { id: userId }, relations: ['projects'] });
    owner.projects.push(project);

    await this.userRepository.save(owner);

    return newProject;

  }

  async update(slug: string, projectData: any): Promise<ProjectRO> {
    let toUpdate = await this.projectRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, projectData);
    const project = await this.projectRepository.save(updated);
    return {project};
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.projectRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
