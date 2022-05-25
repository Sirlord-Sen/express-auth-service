type CurrentUser = {
  userId: string;
  jti?: string
};

type Context = {
  os?:string,
  browser?: string,
  ip?: string,
  userAgent?: string
}
  
declare namespace Express {
  export interface Request {
    currentUser: CurrentUser;
    ctx: Context;
    params: any;
  }
}