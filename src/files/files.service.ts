import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/users.schema';
import { FilesUploaderAws } from './files.uploader.aws';
import { FilesUploaderGcp } from './files.uploader.gcp';
import { UserAvatar } from '../users/interfaces/user.avatar';

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
    const userId = user['_id'].toString();
    const tempFile = await this.transformToTempFile(fileMulter);
    const compressedFile = await this.compressImage(tempFile);
    const thumbnailFile: File = await this.resizeImage(
      compressedFile,
      thumbnailConfig.width,
      thumbnailConfig.height,
    );
    const originalAddress: string = await this.filesUploaderAws.uploadToCloud(
      compressedFile,
      userId,
    );
    const thumbnailAddress: string = await this.filesUploaderGcp.uploadToCloud(
      thumbnailFile,
      userId,
    );
    return {
      original: originalAddress,
      thumbnail: thumbnailAddress,
    };
  }
}
