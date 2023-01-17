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

    // work with original image size
    readable(fileMulter)
      .pipe(compressImage())
      .pipe(saveBufferAsFile(fileMulter.path));

    const imageOnCloudWithOriginalSize: string =
      await filesUploader.uploadToCloud(fileMulter, userId);

    // work with thumbnail
    readable(fileMulter)
      .pipe(resizeImage(thumbnailConfig.width, thumbnailConfig.height))
      .pipe(saveBufferAsFile(fileMulter.path));

    fileMulter.originalname = `thumbnail-${fileMulter.originalname}`;

    const thumbnailAddress: string = await filesUploader.uploadToCloud(
      fileMulter,
      userId,
    );

    const result = {
      original: imageOnCloudWithOriginalSize,
      thumbnail: thumbnailAddress,
    };

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
