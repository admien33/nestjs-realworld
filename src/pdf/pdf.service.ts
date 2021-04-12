import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../project/project.entity';


@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
   
  ) {}

  async generatePdf(): Promise<any> {
    return {pdf: 'pdf'};
  }

}
