import { Post, Controller, UseInterceptors, UploadedFiles, Body, UploadedFile} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { SampleDto, UploadFile } from './pdf.interface';
import { PdfService } from './pdf.service';

// @ApiBearerAuth()
@ApiTags('generatePdf')
@Controller('pdf')
export class PdfController {

  constructor(private readonly _pdfService: PdfService) {}

  @ApiOperation({ summary: 'Generate Pdf' })
  @ApiResponse({ status: 201, description: 'The Pdf has been successfully generated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('generate')
  async generatePdf(): Promise<any> {
    return await this._pdfService.generatePdf();
  }

  @ApiOperation({ summary: 'Upload Pdf' })
  @ApiResponse({ status: 201, description: 'The Pdf has been successfully upload.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @Body() body: SampleDto,
    @UploadedFiles() files: UploadFile[]) {
      console.log(files);
      const inventoryFile: UploadFile = files.filter((file) => file.fieldname === 'inventory-file')[0];
      const rawFile: UploadFile = files.filter((file) => file.fieldname === 'raw-file')[0];

      return {
        body,
        inventoryBuffer: inventoryFile.originalname,
        rawBuffer: rawFile.buffer.toString()
      };
  }
}

// https://github.com/nestjs/nest/tree/master/sample/29-file-upload
// https://docs.nestjs.com/techniques/file-upload