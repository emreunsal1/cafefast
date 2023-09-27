import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_TOKEN_NAME } from "./constants";

const redirect = (path, request) => NextResponse.redirect(new URL(path, request.url));

const verifyJWT = async (authToken) => {
  try {
    const secretKeyUint8 = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const verifiedToken = await jwtVerify(authToken, secretKeyUint8);
    return verifiedToken;
  } catch (err) {
    return false;
  }
};

export async function middleware(request) {
  if (request.cookies.has(AUTH_TOKEN_NAME)) {
    const authToken = request.cookies.get(AUTH_TOKEN_NAME).value;
    const isLogin = verifyJWT(authToken);
    if (isLogin) {
      return;
    }
  }

  return redirect("/auth/login", request);
}

// Add authentication required paths here
export const config = {
  matcher: ["/menu", "/products", "/profile", "/"],
};
