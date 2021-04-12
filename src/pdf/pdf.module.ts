import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { ProjectEntity } from '../project/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity]), UserModule],
  providers: [PdfService],
  controllers: [
    PdfController
  ]
})
export class PdfModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'generatePdf', method: RequestMethod.POST}
      );
  }
}
