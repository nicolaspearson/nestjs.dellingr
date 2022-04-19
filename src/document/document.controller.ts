import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UploadDocumentRequest } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '$/common/error';
import { multerPdfFileFilter } from '$/common/filters/multer-pdf-file.filter';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { DocumentService } from '$/document/document.service';

const TAG = ApiGroup.Document;

@Controller()
export class DocumentController {
  private readonly logger: Logger = new Logger(DocumentController.name);

  constructor(private readonly documentService: DocumentService) {
    this.logger.debug('Document controller created!');
  }

  @Post('documents')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to upload a new document and link it to a transaction.',
    description: 'Uploads a new document to AWS S3 for the authenticated user.',
  })
  @ApiTags(TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Document successfully uploaded.',
    type: UploadDocumentRequest,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payload provided.',
    type: BadRequestError,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access denied.',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The provided transaction does not exist.',
    type: NotFoundError,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'The AWS S3 upload failed.',
    type: NotFoundError,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  @UseInterceptors(FileInterceptor('file', { fileFilter: multerPdfFileFilter }))
  async upload(
    @Req() req: Api.AuthenticatedRequest,
    @Body() dto: UploadDocumentRequest,
    @UploadedFile() file: Api.ThirdParty.MulterFile,
  ): Promise<void> {
    return this.documentService.upload(req.userUuid, dto, file.buffer);
  }
}
