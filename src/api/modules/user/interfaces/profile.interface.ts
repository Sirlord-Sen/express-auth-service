import { Gender } from "@utils/utility-types";

export interface IProfile {
    firstname?: string;
    lastname?: string;
    gender?: Gender
    userId?: string;
    picture?: string;
  }