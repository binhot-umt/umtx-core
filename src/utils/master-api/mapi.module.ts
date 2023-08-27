import { Module } from '@nestjs/common';
import { MapiService } from './mapi.service';
import { UtilsService } from '../utils.service';

@Module({
  providers: [UtilsService, MapiService],
  exports: [MapiService],
})
export class MApiModule {}
