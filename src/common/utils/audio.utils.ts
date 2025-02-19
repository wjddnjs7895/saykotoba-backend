import ffmpeg from 'fluent-ffmpeg';
import stream from 'stream';

export function convertM4AToWav(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputStream = new stream.PassThrough();
    inputStream.end(inputBuffer);
    const chunks: Buffer[] = [];
    const outputStream = new stream.PassThrough();

    ffmpeg(inputStream)
      .format('wav')
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve(Buffer.concat(chunks));
      })
      .pipe(outputStream, { end: true });

    outputStream.on('data', (chunk) => {
      chunks.push(chunk);
    });
  });
}
