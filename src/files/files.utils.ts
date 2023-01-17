import * as Buffer from 'buffer';
import * as fs from 'fs';
import { Readable, Writable, Transform, TransformCallback } from 'stream';
import sharp from 'sharp';

export function multerToBuffer(fileMulter: Express.Multer.File): Buffer {
  if (fs.existsSync(fileMulter.path)) {
    return fs.readFileSync(fileMulter.path);
  } else {
    throw new Error('fileMulter.path contains incorrect file address');
  }
}

/**
 * Transform file that contains into Multer to Readable Stream.
 * @param fileMulter with Disk Storage file only (not Memory Storage).
 */
export function readable(fileMulter: Express.Multer.File): Readable {
  if (!fileMulter) {
    throw new Error('FileUtils: readable(): multer is undefined!');
  }
  const buffer = multerToBuffer(fileMulter);
  return Readable.from(buffer);
}

/**
 * Transformation stream that got a Buffer from Readable and push output as Writable.
 */
export function compressImage(): Transform {
  return new Transform({
    async transform(
      chunk: Buffer,
      encoding: BufferEncoding,
      callback: TransformCallback,
    ) {
      const compressedImage = await sharp(chunk)
        .jpeg({ progressive: true, mozjpeg: true, force: false, quality: 80 })
        .png({ compressionLevel: 9, force: false, quality: 80 })
        .withMetadata()
        .toBuffer();
      this.push(compressedImage);
      callback();
    },
  });
}

/**
 * Writable stream that got a file path from Readable and store it.
 * @param filePathDestination e.g. './dist/tempFiles/cat1.jpg'
 */
export function saveBufferAsFile(filePathDestination: string): Writable {
  return new Writable({
    async write(chunk, encoding, next) {
      fs.writeFileSync(filePathDestination, chunk);
      next();
    },
  });
}

/**
 * Transformation stream that got an image as a Buffer from Readable and push resized output as Writable.
 */
export function resizeImage(width: number, height: number): Transform {
  return new Transform({
    async transform(
      chunk: Buffer,
      encoding: BufferEncoding,
      callback: TransformCallback,
    ) {
      const data = await sharp(chunk)
        .resize(width, height)
        .withMetadata()
        .toBuffer();

      this.push(data);
      callback();
    },
  });
}

export function removeFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    return fs.rmSync(filePath);
  }
}
