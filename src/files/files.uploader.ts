import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import * as Buffer from 'buffer';
import * as fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export abstract class FilesUploader {
  @Inject()
  protected readonly configService: ConfigService;

  /**
   * @param fileMulter that have to been uploaded to some cloud.
   * Express.Multer.File containing file metadata and access information.
   * @param userId that will be used for creating folder with userId's name
   * @return Promise<string> address of cloud storage
   */
  abstract uploadToCloud(
    fileMulter: Express.Multer.File,
    userId: string,
  ): Promise<string>;

  protected multerToBuffer(fileMulter: Express.Multer.File): Buffer {
    if (fs.existsSync(fileMulter.path)) {
      return fs.readFileSync(fileMulter.path);
    } else {
      throw new Error('fileMulter.path contains incorrect file address');
    }
  }

  protected multerToReadable(fileMulter: Express.Multer.File): Readable {
    const buffer = this.multerToBuffer(fileMulter);
    return Readable.from(buffer);
  }
}
