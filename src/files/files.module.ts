import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app.config.module';
import { FilesUploaderAws } from './files.uploader.aws';
import { FilesUploaderGcp } from './files.uploader.gcp';
import { FilesService } from './files.service';

@Module({
  imports: [AppConfigModule],
  providers: [FilesUploaderAws, FilesUploaderGcp, FilesService],
  exports: [FilesService],
})
export class FilesModule {}
