type CurrentUser = {
    userId: string;
    jti?: string
  };
  
  declare namespace Express {
    export interface Request {
      currentUser: CurrentUser;
      params: any;
    }
  }