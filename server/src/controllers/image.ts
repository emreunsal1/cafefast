import { Request, Response } from "express";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

import { uploadPhotoToS3 } from "../services/aws";
import {
  DEFAULT_IMAGE_EXTENSION,
  DEFAULT_IMAGE_UPLOAD_TYPE, FILE_UPLOAD_NAME_CHARACTER_LIMIT,
} from "../constants";
import logger from "../utils/logger";

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.send("not found");
    }

    const result = await sharp(req.file.buffer).resize({ width: 500, withoutEnlargement: true }).toFormat(DEFAULT_IMAGE_UPLOAD_TYPE, {
      quality: 80, lossless: true, compression: "hevc",
    }).toBuffer();

    const fileNameWithoutExtension = req.file.originalname
      .split(".")[0]
      .substring(0, FILE_UPLOAD_NAME_CHARACTER_LIMIT);
    const fileName = `${uuid()}-${fileNameWithoutExtension}${DEFAULT_IMAGE_EXTENSION}`;
    await uploadPhotoToS3(fileName, result);

    res.send({
      fileName,
    });
  } catch (error: any) {
    res.status(400).send(error);
  }
};

export const uploadMultiImagesController = async (req: Request, res: Response) => {
  try {
    if (!req.files?.length) {
      return res.status(400).send("files array not found");
    }

    const fileResizePromises = req.files.map((file) => sharp(file.buffer)
      .resize({ width: 500, withoutEnlargement: true })
      .toFormat(DEFAULT_IMAGE_UPLOAD_TYPE, {
        quality: 80, lossless: true, compression: "hevc",
      }).toBuffer());
    const results = await Promise.all(fileResizePromises);

    const fileNameArray: string[] = [];
    const uploadPromises = results.map((fileBuffer, index) => {
      const fileNameWithoutExtension = req.files![index].originalname
        .split(".")[0]
        .substring(0, FILE_UPLOAD_NAME_CHARACTER_LIMIT);
      const fileName = `${uuid()}-${fileNameWithoutExtension}${DEFAULT_IMAGE_EXTENSION}`;
      fileNameArray.push(fileName);
      return uploadPhotoToS3(fileName, fileBuffer);
    });
    const uploadResults = await Promise.all(uploadPromises);

    if (uploadResults.length !== fileNameArray.length) {
      logger.error({
        message: "lengths not matching after fileUpload",
        fileNameArrayLength: fileNameArray.length,
        uploadResultsLength: uploadResults.length,
        action: "MULTIPLE_FILE_UPLOAD",
      });
      return res.status(500).send({
        message: "lengths not matching after fileUpload",
        fileNameArrayLength: fileNameArray.length,
        uploadResultsLength: uploadResults.length,
      });
    }

    return res.send(fileNameArray);
  } catch (error: any) {
    console.log("error :>> ", error);
    res.status(400).send(error);
  }
};
