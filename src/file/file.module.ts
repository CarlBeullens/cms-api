import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileMapper } from './mappers/file.mapper';
import { PrismaModule } from 'prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, StorageModule, AuthModule],
  providers: [FileService, FileMapper],
  controllers: [FileController]
})
export class FileModule {}
