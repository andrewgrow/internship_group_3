import { FilesUploader } from './files.uploader';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesUploaderAws extends FilesUploader {
  async uploadToCloud(fileMulter: Express.Multer.File, userId: string) {
    // see './src/config/configuration.ts'
    const config = this.configService.get('cloudProvider.awsConfig');
    console.log('AwsService', 'uploadToCloud', config);
    const result = `AWS successful uploaded with userId: ${userId}, fileName: ${fileMulter?.originalname}`;
    return Promise.resolve(result);
  }
}
