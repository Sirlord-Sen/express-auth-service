class OAuthConfig{
    readonly clientId: string;
    readonly clientSecret: string;
    readonly refreshToken: string;
  
    constructor() {
  
      this.clientId = String(process.env.OAUTH_CLIENTID)
      this.clientSecret = String(process.env.OAUTH_CLIENT_SECRET)
      this.refreshToken = String(process.env.OAUTH_REFRESH_TOKEN)
    }
  }
  
  export default new OAuthConfig();