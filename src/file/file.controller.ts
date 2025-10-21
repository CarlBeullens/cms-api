import { BadRequestException, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResponseDto } from './dto/file-response-dto';
import { FileStatus } from '@prisma/client';
import { ParseFileStatusPipe } from './pipes/parse-file-status.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users/:userId/files')
export class FileController {

  constructor(
    private readonly fileService: FileService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  public async createFileUpload(@Param('userId', ParseUUIDPipe) userId: string, @UploadedFile() file: Express.Multer.File)
  : Promise<FileResponseDto> { 
       
    console.log('✅ Endpoint reached!');
    
    if (!file) throw new BadRequestException('No file provided');

    console.log('Uploading...')
    
    return this.fileService.createFileUpload(userId, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('download/:fileId')
  @HttpCode(HttpStatus.OK)
  public async getDownloadUrl(@Param('fileId', ParseUUIDPipe) fileId: string) : Promise<{ url: string; expiresIn: number }> {

    console.log('Endpoint reached!');
    
    return this.fileService.getDownloadUrl(fileId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get() 
  @HttpCode(HttpStatus.OK)
  public async findAllByUserId(@Param('userId', ParseUUIDPipe) userId: string) : Promise<FileResponseDto[]> {
    
    console.log('✅ Endpoint reached!');
    
    return this.fileService.findAllByUserId(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:fileId')
  @HttpCode(HttpStatus.OK)
  public async deleteFileById(@Param('fileId', ParseUUIDPipe) fileId: string) {

    console.log('✅ Endpoint reached!');
    
    return this.fileService.deleteFileById(fileId);
  }

  @Patch(':fileId/status/:status')
  @HttpCode(HttpStatus.OK)
  public async updateFileStatus(
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @Param('status', ParseFileStatusPipe) status: FileStatus)
  : Promise<FileResponseDto> {
  
    return this.fileService.updateFileStatus(fileId, status);
  }

}
