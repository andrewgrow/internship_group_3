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
    const filesUploader = this.selectUploaderByCloudConfigName();
    const userId = user['_id'].toString();

    const result = await new Promise((resolve, reject): void => {
      readable(fileMulter)
        .pipe(compressImage())
        .pipe(saveBufferAsFile(fileMulter.path))
        .on('finish', () => {
          resolve(null);
        })
        .on('error', (err) => {
          reject(err);
        });
    })
      .then(() => {
        return filesUploader.uploadToCloud(fileMulter, userId);
      })
      .then(async (imageOnCloudWithOriginalSize: string) => {
        return new Promise((resolve, reject) => {
          readable(fileMulter)
            .pipe(resizeImage(thumbnailConfig.width, thumbnailConfig.height))
            .pipe(saveBufferAsFile(fileMulter.path))
            .on('finish', () => {
              fileMulter.originalname = `thumbnail-${fileMulter.originalname}`;
              resolve(imageOnCloudWithOriginalSize);
            })
            .on('error', (err) => {
              reject(err);
            });
        });
      })
      .then(async (imageOnCloudWithOriginalSize: string) => {
        const thumbnailAddress = await filesUploader.uploadToCloud(
          fileMulter,
          userId,
        );
        return {
          original: imageOnCloudWithOriginalSize,
          thumbnail: thumbnailAddress,
        };
      });

    console.log('Upload result:', result);

    removeFile(fileMulter.path); // delete tempFile

    return result;
  }

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
}
