import {
  ListBucketsCommand, PutObjectCommand, S3Client,
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
import logger from "../utils/logger";
import { DEFAULT_IMAGE_UPLOAD_MIME_TYPE } from "../constants";

config();
const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

export const checkS3Connection = async () => {
  try {
    const results = await s3.send(new ListBucketsCommand({}));
    logger.info({ message: "Connected to s3", buckets: results.Buckets?.map((bck) => bck.Name) });
  } catch (err) {
    logger.error({ message: "Error when connection to s3 cluster", error: err });
    throw err;
  }
};

export const uploadPhotoToS3 = async (filename, contentAsBase64, bucket = "cafefast") => s3.send(new PutObjectCommand({
  Bucket: bucket,
  Key: filename,
  Body: contentAsBase64,
  ContentType: DEFAULT_IMAGE_UPLOAD_MIME_TYPE,
}));
