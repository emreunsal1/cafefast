import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY as string;

export const verifyJWT = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    const data = jwt.verify(token, secretKey);
    req.user = data;
    next();
  } catch (error) {
    return false;
  }
};

export const generateJwt = async (user) => {
  try {
    const generatedJWT = await jwt.sign(user, secretKey, {
      expiresIn: 3600,
    });
    return generatedJWT;
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      console.log(error);
    }
    return false;
  }
};
