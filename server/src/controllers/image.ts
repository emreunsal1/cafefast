import { Request, Response } from "express";
import sharp from "sharp";

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.send("not found");
    }

    const result = await sharp(req.file.buffer).resize({ width: 500, withoutEnlargement: true }).toFormat("jpeg", {
      quality: 80, lossless: true, compression: "hevc",
    }).toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.set("Content-Length", String(result.length));
    res.send(result);
  } catch (error: any) {
    res.send(error);
  }
};
