import { FilesUploader } from './files.uploader';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesUploaderGcp extends FilesUploader {
  async uploadToCloud(fileMulter: Express.Multer.File, userId: string) {
    // see './src/config/configuration.ts'
    const config = this.configService.get('cloudProvider.gcpConfig');
    console.log('GCPService', 'uploadToCloud', config);
    const result = `GCP successful uploaded with userId: ${userId}, fileName: ${fileMulter?.originalname}`;
    return Promise.resolve(result);
  }
}
