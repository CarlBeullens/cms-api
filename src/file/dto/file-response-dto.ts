import { FileStatus } from '@prisma/client';

export class FileResponseDto {
  fileId: string
  userId: string;                    
  filename: string;              
  originalName: string;          
  mimeType: string;              
  size: number;     
  formattedSize: string;         // Human-readable (e.g., "2.5 MB")       
  status: FileStatus;            
  storageKey: string;
  createdAt: Date;               
  updatedAt: Date;               
}