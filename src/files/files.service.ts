import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async compressImage(file: File): Promise<File> {
    console.log('TransformService', 'compressionImage');
    return Promise.resolve(file);
  }

  async resizeImage(file: File): Promise<File> {
    console.log('TransformService', 'resizeImage');
    return Promise.resolve(file);
  }

  transformToTempFile(fileMulter: Express.Multer.File): File {
    return undefined;
  }
}
