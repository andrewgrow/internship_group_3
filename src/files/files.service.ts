import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/users.schema';
import { FilesUploaderAws } from './files.uploader.aws';
import { FilesUploaderGcp } from './files.uploader.gcp';
import { UserAvatar } from '../users/interfaces/user.avatar';
import { ConfigService } from '@nestjs/config';
import { FilesUploader } from './files.uploader';

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

  async compressImage(file: File): Promise<File> {
    console.log('TransformService', 'compressImage', file?.name);
    return Promise.resolve(file);
  }

  async resizeImage(file: File, width: number, height: number): Promise<File> {
    console.log('TransformService', 'resizeImage', width, height);
    return Promise.resolve(file);
  }

  transformToTempFile(fileMulter: Express.Multer.File): File {
    return undefined;
  }

  async uploadAvatarToClouds(
    fileMulter: Express.Multer.File,
    user: User,
  ): Promise<UserAvatar> {
    const filesUploader = this.selectUploaderByCloudConfigName();
    const userId = user['_id'].toString();
    const tempFile = await this.transformToTempFile(fileMulter);
    const compressedFile = await this.compressImage(tempFile);
    const thumbnailFile: File = await this.resizeImage(
      compressedFile,
      thumbnailConfig.width,
      thumbnailConfig.height,
    );
    const originalAddress: string = await filesUploader.uploadToCloud(
      compressedFile,
      userId,
    );
    const thumbnailAddress: string = await filesUploader.uploadToCloud(
      thumbnailFile,
      userId,
    );
    return {
      original: originalAddress,
      thumbnail: thumbnailAddress,
    };
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
