import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FileResponseDto } from './dto/file-response-dto';
import { FileStatus } from '@prisma/client';
import { FileMapper } from './mappers/file.mapper';
import { PrismaService } from 'prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class FileService {

	constructor(
			private readonly prisma: PrismaService,
			private readonly storage: StorageService,
			private readonly mapper: FileMapper
	) {}

  public async createFileUpload(userId: string, file: Express.Multer.File): Promise<FileResponseDto> {

    const storageKey = await this.storage.uploadFile(file);

		const fileName = storageKey.split('/').pop();
		
		const fileRecord = await this.prisma.file.create({
			data: {
				userId: userId,
				filename: fileName!,
				originalName: file.originalname,
				mimeType: file.mimetype,
				size: file.size,
				status: FileStatus.READY,
				storageKey: storageKey
			},
			include: { user: true }
  	});

  	return this.mapper.toDto(fileRecord);
  }

	public async getDownloadUrl(fileId: string) : Promise<{ url: string; expiresIn: number }> {

		const file = await this.findFileById(fileId);

		if (file.status != 'READY') {
			throw new BadRequestException('File is not ready for download');
		}
		
		const url = await this.storage.getDownloadUrl(file.storageKey);

		return { url, expiresIn: 3600};
	}

	public async findAllByUserId(userId: string, status?: FileStatus): Promise<FileResponseDto[]> {

		const query: any = { userId: userId };
  
		if (status) {
			query.status = status;
		}
  
		const files = await this.prisma.file.findMany({
			where: query,
			orderBy: { createdAt: 'desc' }
  	});
  
  	return files.map(file => this.mapper.toDto(file));
	}

	private async findFileById(fileId: string): Promise<FileResponseDto> {

		const file = await this.prisma.file.findUnique({
			where: { id: fileId }, 
			include: { user: true }
		});

		if (!file) {
			throw new NotFoundException;
		}
		
		return this.mapper.toDto(file);
	}

	public async deleteFileById(fileId: string) {
    
		const file = await this.findFileById(fileId);

		try {
			// delete the file from storage
			await this.storage.deleteFile(file.storageKey);
			
			// delete the record from the db
			await this.prisma.file.delete({
				where: { id: fileId }
			})

			console.log(`Deleted ${file.originalName} (fileId: ${fileId})`);
		}

		catch(error) {
			throw new InternalServerErrorException(`Failed to delete file: ${error.message}`)
		}
  }

	public async updateFileStatus(fileId: string , status: FileStatus) : Promise<FileResponseDto> {

		try {
			const updatedFile = await this.prisma.file.update({
				where: { id: fileId },
				data: { status },
				include: { user: true }
    	});

			return this.mapper.toDto(updatedFile);
		}

		catch(error) {
			console.log(error.message);

			if (error.code === 'P2025') {
      	throw new NotFoundException(`File with ID ${fileId} not found`);
    	}

			throw error;
		}
	}
	
}


