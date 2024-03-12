import fs from "fs";

import { Client } from "minio";

import { env } from "~/env";
import { generateId } from "~/lib/utils/generate-id";

interface File {
  path: string;
  type: string;
}

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
    console.log("Bucket exists:", bucketExists);
    if (!bucketExists) {
      await minio.makeBucket(bucketName);
      console.log("Bucket created successfully:", bucketName);
    }
  } catch (error) {
    console.error("Failed to create bucket:", error);
    throw new Error("Failed to create bucket");
  }
}

export async function uploadFile(fileBuffer: Buffer, mimetype: string) {
  try {
    const imageName = `${generateId(15)}.${mimetype.split("/")[1]}`;
    const bucketName = env.MINIO_BUCKET;
    console.log("Uploading file:", imageName);
    console.log(fileBuffer);

    await createBucket(bucketName);

    await minio.putObject(bucketName, imageName, fileBuffer);

    const imageUrl = await minio.presignedUrl("GET", bucketName, imageName);
    console.log("File uploaded successfully:", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw new Error("Failed to upload file");
  }
}
