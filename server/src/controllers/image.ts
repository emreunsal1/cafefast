import { Request, Response } from "express";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

import { uploadPhotoToS3 } from "../services/aws";
import {
  DEFAULT_IMAGE_EXTENSION,
  DEFAULT_IMAGE_UPLOAD_TYPE, FILE_UPLOAD_NAME_CHARACTER_LIMIT,
} from "../constants";

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
