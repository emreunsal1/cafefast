import { Request, Response } from "express";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

import { getImageFromS3, uploadPhotoToS3 } from "../services/aws";

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.send("not found");
    }

    const result = await sharp(req.file.buffer).resize({ width: 500, withoutEnlargement: true }).toFormat("jpeg", {
      quality: 80, lossless: true, compression: "hevc",
    }).toBuffer();

    const fileName = `${uuid()}-${req.file.originalname}`;
    const uploadResult = await uploadPhotoToS3(fileName, result);

    res.send({
      fileName,
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

    res.set("Content-Type", "image/jpeg");
    res.set("Content-Length", String(result.ContentLength));
    res.send(result.Body);
  } catch (error: any) {
    res.status(400).send(error);
  }
};
