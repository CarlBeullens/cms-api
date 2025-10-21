import { Injectable } from "@nestjs/common";
import { File } from "@prisma/client";
import { FileResponseDto } from "../dto/file-response-dto";

@Injectable()
export class FileMapper {

    public toDto(file: File): FileResponseDto {
			
			return {
				fileId: file.id,
				userId: file.userId,
				filename: file.filename,
				originalName: file.originalName,
				mimeType: file.mimeType,
				size: file.size,
				formattedSize: FileMapper.formatFileSize(file.size),
				status: file.status,
				storageKey: file.storageKey,
				createdAt: file.createdAt,
				updatedAt: file.updatedAt,
			};
    }

		private static formatFileSize(bytes: number): string {
			
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const sizes = ['Bytes', 'KB', 'MB', 'GB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));

			return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
		}
}