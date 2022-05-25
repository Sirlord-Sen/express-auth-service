type CurrentUser = {
  userId: string;
  jti?: string
};

type Context = {
  os?:string,
  browser?: string
}
  
declare namespace Express {
  export interface Request {
    currentUser: CurrentUser;
    ctx: Context;
    params: any;
  }
}