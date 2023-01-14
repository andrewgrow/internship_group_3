import { FilesUploader } from './files.uploader';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesUploaderAws extends FilesUploader {
  async uploadToCloud(file: File): Promise<string> {
    // see './src/config/configuration.ts'
    const config = this.configService.get('awsConfig');
    console.log('AwsService', 'uploadToCloud', config);
    return Promise.resolve(file.name);
  }
}
