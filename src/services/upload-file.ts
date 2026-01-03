import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3-bucket';

export async function uploadImageToS3Bucket(
  file: Buffer,
  key: string,
  contentType: string = 'image/png'
) {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET environment variable is not configured');
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType
    })
  );
}
