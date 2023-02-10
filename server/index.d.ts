/* eslint-disable no-unused-vars */

declare namespace Express {
  interface Request {
    user: {
      name: string;
      surname: string;
      email: string;
      variant: number;
    },
    cookies: {
      AUTH_TOKEN_COOKIE_NAME?: string
    }
  }
}
