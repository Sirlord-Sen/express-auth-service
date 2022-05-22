type CurrentUser = {
  userId: string;
  jti?: string
};

type UserAgent = {
  os?:string,
  browser?: string
}
  
declare namespace Express {
  export interface Request {
    currentUser: CurrentUser;
    userAgent: UserAgent;
    params: any;
  }
}