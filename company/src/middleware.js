import { NextResponse } from "next/server";
import { AUTH_TOKEN_NAME, CLIENT_SIDE_IS_LOGIN_COOKIE_NAME } from "./constants";
import { verifyJWT } from "./utils/auth";

const redirect = (path, request) => NextResponse.redirect(new URL(path, request.url));

export async function middleware(request) {
  if (request.cookies.has(AUTH_TOKEN_NAME)) {
    const authToken = request.cookies.get(AUTH_TOKEN_NAME).value;
    const isLogin = await verifyJWT(authToken);
    if (isLogin) {
      const nextResponse = NextResponse.next();
      nextResponse.headers.set("x-pass-ss-auth", "true");
      nextResponse.cookies.set(CLIENT_SIDE_IS_LOGIN_COOKIE_NAME, "true");
      return nextResponse;
    }
  }

  const redirectResponse = redirect("/auth/login", request);
  redirectResponse.cookies.set(CLIENT_SIDE_IS_LOGIN_COOKIE_NAME, "false");
  return redirectResponse;
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
