import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3-bucket';

export async function uploadImageToS3Bucket(file: Buffer, key: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: 'image/png'
    })
  );
}
