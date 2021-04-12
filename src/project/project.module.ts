import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { File } from './file.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { ProjectService } from './project.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, File, UserEntity, FollowsEntity]), UserModule],
  providers: [ProjectService],
  controllers: [
    ProjectController
  ]
})
export class ProjectModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        // {path: 'projects/feed', method: RequestMethod.GET},
        {path: 'projects', method: RequestMethod.POST},
        {path: 'projects/:slug', method: RequestMethod.DELETE},
        {path: 'projects/:slug', method: RequestMethod.PUT},
        {path: 'projects/:slug/files', method: RequestMethod.POST},
        {path: 'projects/:slug/files/:id', method: RequestMethod.DELETE},
        // {path: 'projects/:slug/favorite', method: RequestMethod.POST},
        // {path: 'projects/:slug/favorite', method: RequestMethod.DELETE}
      );
  }
}
