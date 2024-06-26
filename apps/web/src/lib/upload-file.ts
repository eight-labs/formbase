import { Client } from 'minio';

import { env } from '@formbase/env';
import { generateId } from '@formbase/utils/generate-id';

type FormData = Record<string, Blob | string | undefined>;

const minio = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USESSL,
  accessKey: env.MINIO_ACCESSKEY,
  secretKey: env.MINIO_SECRETKEY,
});

export async function createBucket(bucketName: string) {
  try {
    const bucketExists = await minio.bucketExists(bucketName);
    if (!bucketExists) {
      await minio.makeBucket(bucketName);
      console.info('Bucket created successfully:', bucketName);
    } else {
      console.info('Bucket already exists:', bucketName);
    }
  } catch (error) {
    console.error('Failed to create bucket:', error);
    throw new Error('Failed to create bucket');
  }
}

export async function uploadFile(fileBuffer: Buffer, mimetype: string) {
  try {
    const imageName = `${generateId(15)}.${mimetype.split('/')[1]}`;
    const bucketName = env.MINIO_BUCKET;
    console.info('Uploading file:', imageName);

    await createBucket(bucketName);
    await minio.putObject(bucketName, imageName, fileBuffer);

    const imageUrl = await minio.presignedUrl('GET', bucketName, imageName);
    console.info('File uploaded successfully:', imageUrl);

    return imageUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function uploadFileFromBlob({
  file,
}: {
  file: Blob;
}): Promise<string> {
  const response = new Response(file);
  const buffer = await response.arrayBuffer();
  return uploadFile(Buffer.from(buffer), file.type);
}

export function assignFileOrImage({
  formData,
  key,
  fileUrl,
}: {
  formData: FormData;
  key: string;
  fileUrl: string;
}): void {
  const isImage =
    formData[key] instanceof Blob &&
    (formData[key] as Blob).type.startsWith('image/');
  const field = isImage ? 'image' : 'file';
  formData[field] = fileUrl;

  if (key !== 'file' && key !== 'image') {
    formData[key] = undefined;
  }
}
