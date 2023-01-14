import { FilesUploader } from './files.uploader';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesUploaderGcp extends FilesUploader {
  uploadToCloud(file: File) {
    // see './src/config/configuration.ts'
    const config = this.configService.get('gcpConfig');
    console.log('AwsService', 'uploadToCloud', config);
    return Promise.resolve(file.name);
  }
}
