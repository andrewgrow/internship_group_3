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

    // result that will be filled after uploading
    const result: UserAvatar = {
      original: undefined,
      thumbnail: undefined,
    };

    await this.processOriginalSize(fileMulter)
      .then((originalFileName) => {
        console.log('Upload to cloud:', originalFileName);
        return filesUploader.uploadToCloud(fileMulter, userId);
      })
      .then(async (imageAddressOnCloud: string) => {
        result.original = imageAddressOnCloud;
        return this.processThumbnailFile(fileMulter);
      })
      .then(async (thumbnailFileName) => {
        console.log('Upload to cloud:', thumbnailFileName);
        return filesUploader.uploadToCloud(fileMulter, userId);
      })
      .then((imageAddressOnCloud) => {
        result.thumbnail = imageAddressOnCloud;
      });

    console.log('Upload result:', result);

    removeFile(fileMulter.path); // delete tempFile

    return result;
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
   * @param multer with data that have to be transformed
   */
  private processOriginalSize(multer: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject): void => {
      readable(multer)
        .pipe(compressImage())
        .pipe(saveBufferAsFile(multer.path))
        .on('finish', () => {
          resolve(multer.path);
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
   * @param multer with data that have to be transformed
   */
  private processThumbnailFile(multer: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      readable(multer)
        .pipe(resizeImage(thumbnailConfig.width, thumbnailConfig.height))
        .pipe(saveBufferAsFile(multer.path))
        .on('finish', () => {
          multer.originalname = `thumbnail-${multer.originalname}`;
          resolve(multer.originalname);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
}
