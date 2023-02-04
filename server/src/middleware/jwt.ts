import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

export const verifyJWT =async (req,res,next) => {
  try {
    const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
   jwt.verify(token,secretKey);
    next();
  } catch (error) {
    return false;
    
  }

}


export const generateJwt = async (user) => {
  try {
    const generatedJWT = await jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data:user,
    },secretKey)
    return generatedJWT;
  } catch (error: Error| unknown) {
    if(error instanceof Error){
      console.log(error.message);
    }
    return false;
  }
}

