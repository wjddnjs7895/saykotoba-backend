import * as ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

export async function convertM4AToWav(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);
    const outputStream = new PassThrough();
    const chunks: Buffer[] = [];

    ffmpeg(inputStream)
      .toFormat('wav')
      .on('error', (err, stdout, stderr) => {
        console.error('ffmpeg error:', err);
        console.error('ffmpeg stdout:', stdout);
        console.error('ffmpeg stderr:', stderr);
        reject(err);
      })
      .on('end', () => {
        resolve(Buffer.concat(chunks));
      })
      .pipe(outputStream, { end: true });

    outputStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    outputStream.on('finish', () => {
      resolve(Buffer.concat(chunks));
    });

    outputStream.on('close', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
