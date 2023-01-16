import { FilesUploader } from './files.uploader';
import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as stream from 'stream';

@Injectable()
export class FilesUploaderAws extends FilesUploader {
  async uploadToCloud(fileMulter: Express.Multer.File, userId: string) {
    // see './src/config/configuration.ts'
    const config = this.configService.get('cloudProvider.awsConfig');

    const client = new S3Client({
      credentials: config.credentials,
      region: config.region,
    });

    const file = fileMulter.originalname;

    const Key = `uploads/users/${userId}/avatar/${Date.now()}/${file}`;
    const Bucket = config.bucketName;
    const passThroughStream = new stream.PassThrough();

    let res;

    try {
      const parallelUploads3 = new Upload({
        client,
        params: {
          Bucket,
          Key,
          Body: passThroughStream,
          ACL: 'public-read',
        },
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      this.multerToReadable(fileMulter).pipe(passThroughStream);
      res = await parallelUploads3.done();
      console.log('AWS RESULT:', res);
    } catch (e) {
      console.log(e);
    }

    return `${Bucket}/${Key}`;
  }
}
