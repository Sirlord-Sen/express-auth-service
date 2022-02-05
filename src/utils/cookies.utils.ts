import { CookiesConfig } from "../config";
import { TokenResponse } from "@modules/auth/interfaces/token.interface";

export const addAuthToRes: TokenResponse = async (res, {tokenType, accessToken, refreshToken}) => {
    res.setHeader("Authorization", `${tokenType} ${accessToken}`);
    res.cookie("refreshToken", refreshToken, CookiesConfig);
}