import { Request, Response } from "express";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

import { getImageFromS3, uploadPhotoToS3 } from "../services/aws";
import { DEFAULT_IMAGE_EXTENSION, DEFAULT_IMAGE_UPLOAD_MIME_TYPE, DEFAULT_IMAGE_UPLOAD_TYPE } from "../constants";

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.send("not found");
    }

    const result = await sharp(req.file.buffer).resize({ width: 500, withoutEnlargement: true }).toFormat(DEFAULT_IMAGE_UPLOAD_TYPE, {
      quality: 80, lossless: true, compression: "hevc",
    }).toBuffer();

    const fileNameWithoutExtension = req.file.originalname.split(".")[0];
    const fileName = `${uuid()}-${fileNameWithoutExtension}${DEFAULT_IMAGE_EXTENSION}`;
    const uploadResult = await uploadPhotoToS3(fileName, result);

    res.send({
      fileName: uploadResult.Key,
      filePath: `/image/${uploadResult.Key}`,
    });
  } catch (error: any) {
    res.status(400).send(error);
  }
};

export const getImageController = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    const result = await getImageFromS3(filename);

    res
      .set("Content-Type", DEFAULT_IMAGE_UPLOAD_MIME_TYPE)
      .set("Content-Length", String(result.ContentLength))
      .send(result.Body);
  } catch (error: any) {
    res.status(400).send(error);
  }
};
