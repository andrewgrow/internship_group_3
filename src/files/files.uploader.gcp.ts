import { FilesUploader } from './files.uploader';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesUploaderGcp extends FilesUploader {
  uploadToCloud(file: File, userId: string) {
    // see './src/config/configuration.ts'
    const config = this.configService.get('gcpConfig');
    console.log('AwsService', 'uploadToCloud', config);
    const result = `GCP successful uploaded with userId: ${userId}, fileName: ${file?.name}`;
    return Promise.resolve(result);
  }
}
