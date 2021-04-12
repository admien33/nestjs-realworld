import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto, CreateFileDto } from './dto';
import { ProjectsRO, ProjectRO } from './project.interface';
import { FilesRO } from './project.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.'})
  @Get()
  async findAll(@Query() query): Promise<ProjectsRO> {
    return await this.projectService.findAll(query);
  }


  // @ApiOperation({ summary: 'Get project feed' })
  // @ApiResponse({ status: 200, description: 'Return project feed.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Get('feed')
  // async getFeed(@User('id') userId: number, @Query() query): Promise<ProjectsRO> {
  //   return await this.projectService.findFeed(userId, query);
  // }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ProjectRO> {
    return await this.projectService.findOne({slug});
  }

  @Get(':slug/files')
  async findFiles(@Param('slug') slug): Promise<FilesRO> {
    return await this.projectService.findFiles(slug);
  }

  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('project') projectData: CreateProjectDto) {
    return this.projectService.create(userId, projectData);
  }

  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('project') projectData: CreateProjectDto) {
    // Todo: update slug also when title gets changed
    return this.projectService.update(params.slug, projectData);
  }

  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.projectService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create file' })
  @ApiResponse({ status: 201, description: 'The file has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/files')
  async createFile(@Param('slug') slug, @Body('file') fileData: CreateFileDto) {
    return await this.projectService.addFile(slug, fileData);
  }

  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 201, description: 'The project has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/files/:id')
  async deleteFile(@Param() params) {
    const {slug, id} = params;
    return await this.projectService.deleteFile(slug, id);
  }

  // @ApiOperation({ summary: 'Favorite project' })
  // @ApiResponse({ status: 201, description: 'The project has been successfully favorited.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Post(':slug/favorite')
  // async favorite(@User('id') userId: number, @Param('slug') slug) {
  //   return await this.projectService.favorite(userId, slug);
  // }

  // @ApiOperation({ summary: 'Unfavorite project' })
  // @ApiResponse({ status: 201, description: 'The project has been successfully unfavorited.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Delete(':slug/favorite')
  // async unFavorite(@User('id') userId: number, @Param('slug') slug) {
  //   return await this.projectService.unFavorite(userId, slug);
  // }

}