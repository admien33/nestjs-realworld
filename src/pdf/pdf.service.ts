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
export class PdfService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async generatePdf(userId: number): Promise<any> {
    return {userId};
  }

}
