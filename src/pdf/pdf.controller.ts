import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { PdfService } from './pdf.service';

@ApiBearerAuth()
@ApiTags('generatePdf')
@Controller('generatePdf')
export class PdfController {

  constructor(private readonly _pdfService: PdfService) {}

  @ApiOperation({ summary: 'Generate Pdf' })
  @ApiResponse({ status: 201, description: 'The Pdf has been successfully generated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async generatePdf(@User('id') userId: number): Promise<any> {
    return await this._pdfService.generatePdf(userId);
  }

}
