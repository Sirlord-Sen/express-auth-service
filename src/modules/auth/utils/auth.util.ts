import { response } from "express";
import cookiesConfig from "../../../config/cookies.config";
import { TokenResponse } from "../interfaces/token.interface";

export const addAuthToRes: TokenResponse = async (res, {tokenType, accessToken, refreshToken}) => {
    // console.log(`${tokenType} ${accessToken}`)
    res.setHeader("Authorization", `${tokenType} ${accessToken}`);
    res.cookie("refreshToken", refreshToken, cookiesConfig);
};