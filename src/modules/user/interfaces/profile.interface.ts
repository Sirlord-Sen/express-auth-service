import { Gender } from "@utils/utility-types";

export interface IProfile {
    firstName?: string;
    lastName?: string;
    gender?: Gender
    userId?: string;
    picture?: string;
  }