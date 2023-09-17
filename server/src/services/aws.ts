// Load the AWS SDK for Node.js
import AWS from "aws-sdk";
import { config } from "dotenv";
import logger from "../utils/logger";
import { DEFAULT_IMAGE_UPLOAD_MIME_TYPE } from "../constants";

config();
AWS.config.update({ region: "eu-central-1" });
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

export const checkS3Connection = () => new Promise((resolve, reject) => {
  s3.listBuckets((err, data) => {
    if (err) {
      logger.error({ message: "Error when connection to s3 cluster", error: err });
      return reject(err);
    }

    if (data) {
      logger.info({ message: "Connected to s3", buckets: data.Buckets?.map((bck) => bck.Name) });
    }
    return resolve(data);
  });
});

export const uploadPhotoToS3 = (filename, contentAsBase64, bucket = "cafefast") => s3.upload({
  Bucket: bucket,
  Key: filename,
  Body: contentAsBase64,
  ContentType: DEFAULT_IMAGE_UPLOAD_MIME_TYPE,
}).promise();

export const getImageFromS3 = (filename, bucket = "cafefast") => s3.getObject({ Bucket: bucket, Key: filename }).promise();
