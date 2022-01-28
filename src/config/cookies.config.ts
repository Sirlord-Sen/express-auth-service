import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const cookiesConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction ? true : false,
  // Add sameSite & domain for prod
};

export default cookiesConfig;