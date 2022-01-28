import cookiesConfig from "../../../config/cookies.config";
import { AddAuthToResInterface } from '../interfaces/auth.interface'

export const addAuthToRes: AddAuthToResInterface = (res, accessToken, refreshToken) => {
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", refreshToken, cookiesConfig);
};