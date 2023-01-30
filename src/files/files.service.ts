import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/users.schema';
import { FilesUploaderAws } from './files.uploader.aws';
import { FilesUploaderGcp } from './files.uploader.gcp';
import { UserAvatar } from '../users/interfaces/user.avatar';
import { ConfigService } from '@nestjs/config';
import { FilesUploader } from './files.uploader';
import {
  saveBufferAsFile,
  compressImage,
  readable,
  resizeImage,
  removeFile,
} from './files.utils';

const thumbnailConfig = {
  width: 32,
  height: 32,
};

@Injectable()
export class FilesService {
  @Inject()
  private readonly filesUploaderAws: FilesUploaderAws;

  @Inject()
  private readonly filesUploaderGcp: FilesUploaderGcp;

  @Inject()
  private readonly configService: ConfigService;

  async uploadAvatarToClouds(
    fileMulter: Express.Multer.File,
    user: User,
  ): Promise<UserAvatar> {
    const filesUploader = this.selectUploaderByCloudConfigName(); // aws or gcp
    const userId = user['_id'].toString(); // using for creating path on cloud

    await this.processOriginalSize(fileMulter);
    const original = await filesUploader.uploadToCloud(fileMulter, userId);
    await this.processThumbnailFile(fileMulter);
    const thumbnail = await filesUploader.uploadToCloud(fileMulter, userId);

    removeFile(fileMulter.path); // delete tempFile

    return { original: original, thumbnail: thumbnail };
  }

  /**
   * We have to select AWS or GCP cloud provider by config settings.
   */
  selectUploaderByCloudConfigName(): FilesUploader {
    const cloudProviderName = this.configService.get('cloudProvider.name');
    if (cloudProviderName === 'aws') {
      return this.filesUploaderAws;
    } else if (cloudProviderName === 'gcp') {
      return this.filesUploaderGcp;
    } else {
      throw new Error(
        'Your cloud provider not defined. Please set it to .env file as CLOUD_STORAGE_PROVIDER="aws" or CLOUD_STORAGE_PROVIDER="gcp"',
      );
    }
  }

  /**
   * If you do not wait for the promise, then the transformation will end later
   * than the file is uploaded to the cloud.
   * So, we need to wrap pipes to promise and waiting until all transformations
   * pipe will be done and resolve promise.
   * @param fileMulter with data that have to be transformed
   */
  private processOriginalSize(fileMulter: Express.Multer.File): Promise<void> {
    return new Promise((resolve, reject): void => {
      readable(fileMulter)
        .pipe(compressImage())
        .pipe(saveBufferAsFile(fileMulter.path))
        .on('finish', () => {
          resolve(null);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  /**
   * The same transformation as with original size but for thumbnail.
   * We have to waiting until all transformations
   * pipe will be done and resolve promise.
   * @param fileMulter with data that have to be transformed
   */
  private processThumbnailFile(fileMulter: Express.Multer.File): Promise<void> {
    return new Promise((resolve, reject) => {
      readable(fileMulter)
        .pipe(resizeImage(thumbnailConfig.width, thumbnailConfig.height))
        .pipe(saveBufferAsFile(fileMulter.path))
        .on('finish', () => {
          fileMulter.originalname = `thumbnail-${fileMulter.originalname}`;
          resolve(null);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
}
