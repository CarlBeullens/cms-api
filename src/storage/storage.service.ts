import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class StorageService {

  private readonly bucketName = 'cms-uploads';
  private minioClient: Minio.Client;

  constructor() {
    this.initializeMinio();
  }

  public async uploadFile(file: Express.Multer.File, folder: string = '2025')
  : Promise<string> {
    
    try {
      const date = Date.now();
      const randomString = this.generateRandomString(8);
      const extension = file.originalname.split('.').pop();
      const fileName = `${date}-${randomString}.${extension}`;
      
      const storageKey = `${folder}/${fileName}`;

      await this.minioClient.putObject(
        this.bucketName,
        storageKey,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'X-Original-Name': file.originalname,
        },
      );

      console.log(`File uploaded: ${storageKey}`);
      
      return storageKey;
    } 
    
    catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file to storage');
    }
  }

  public async getDownloadUrl(storageKey: string, expiresIn = 3600): Promise<string> {
    
    return this.minioClient.presignedGetObject(this.bucketName, storageKey, expiresIn);
  }

  public async deleteFile(storageKey: string): Promise<void> {
    
    await this.minioClient.removeObject(this.bucketName, storageKey);
  }

  private async initializeMinio() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,  // true for production with HTTPS
      accessKey: 'admin',
      secretKey: 'strong-p@ssword'
    })
  }

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }

}
