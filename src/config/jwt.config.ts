class JwtConfig{
    readonly accessTokenSecret: string;
    readonly accessTokenExpiration: string;
    readonly refreshTokenSecret: string;
    readonly refreshTokenExpiration: string;
  
    constructor() {
  
      this.accessTokenSecret = String(process.env.ACCESS_TOKEN_SECRET)
      this.accessTokenExpiration = String(process.env.ACCESS_TOKEN_EXPIRATION)
      this.refreshTokenSecret = String(process.env.REFRESH_TOKEN_SECRET)
      this.refreshTokenExpiration = String(process.env.REFRESH_TOKEN_EXPIRATION)
    }
  }
  
  export default new JwtConfig();