import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export abstract class FilesUploader {
  @Inject()
  protected readonly configService: ConfigService;

  /**
   * @param file that have to been uploaded to some cloud.
   * @param userId that will be used for creating folder with userId's name
   * @return Promise<string> address of cloud storage
   */
  abstract uploadToCloud(file: File, userId: string): Promise<string>;
}
