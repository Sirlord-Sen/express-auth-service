import { IPlatform } from "./interfaces";

export enum PlatformNetwork {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

export type Platform = IPlatform
export type FullPlatform = Id & Platform & DateInfo