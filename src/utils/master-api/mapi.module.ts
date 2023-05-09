import { Module } from '@nestjs/common';
import { MapiService } from './mapi.service';

@Module({
  providers: [MapiService],
  exports: [MapiService],
})
export class MApiModule {}
