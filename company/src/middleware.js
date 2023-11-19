import { NextResponse } from "next/server";
import { AUTH_TOKEN_NAME } from "./constants";
import { verifyJWT } from "./utils/auth";

const redirect = (path, request) => NextResponse.redirect(new URL(path, request.url));

export async function middleware(request) {
  if (request.cookies.has(AUTH_TOKEN_NAME)) {
    const authToken = request.cookies.get(AUTH_TOKEN_NAME).value;
    const isLogin = verifyJWT(authToken);
    if (isLogin) {
      const nextResponse = NextResponse.next();
      nextResponse.headers.set("x-pass-ss-auth", "true");
      return nextResponse;
    }
  }

  return redirect("/auth/login", request);
}

// Add authentication required paths here
export const config = {
  matcher: [
    "/auth/onboarding",
    "/campaigns",
    "/campaigns/(.*)",
    "/menu",
    "/menu/(.*)",
    "/product",
    "/product/(.*)",
    "/table",
    "/profile",
    "/kitchen",
    "/",
  ],
};
