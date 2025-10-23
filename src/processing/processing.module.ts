import { Module } from '@nestjs/common';
import { ProcessingService } from './processing.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'file-processing' })
  ],
  providers: [ProcessingService],
  exports: [ProcessingService]
})
export class ProcessingModule {}
