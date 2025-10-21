import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { FileStatus } from "@prisma/client";

@Injectable()
export class ParseFileStatusPipe implements PipeTransform<string, FileStatus> {
  
  public transform(status: string): FileStatus {
    const validStatuses = Object.values(FileStatus);
    
    if (!validStatuses.includes(status.toUpperCase() as FileStatus)) {
      const errorMessage = `Not a valid status. Valid statuses: ${validStatuses.join(', ')}`
      
      throw new BadRequestException(errorMessage);
    }

    return status.toUpperCase() as FileStatus;
  }
}