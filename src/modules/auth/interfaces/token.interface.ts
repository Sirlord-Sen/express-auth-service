export interface ITokenPayload{
    jti: string;
    sub: string;
    typ: string;
  };


  export interface IRefreshToken {
    browser?: string;
    expiredAt: Date;
    ip?: string;
    isRevoked?: boolean;
    jti: string;
    os?: string;
    userAgent?: string;
    userId: string;
  }
  