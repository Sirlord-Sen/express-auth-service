class EmailConfig{
  readonly driver: string;
  readonly encryption: string;
  readonly host: string;
  readonly password: string;
  readonly port: number;
  readonly username: string;

  constructor() {

    this.driver = String(process.env.MAIL_DRIVER)
    this.host = String(process.env.MAIL_HOST)
    this.port = Number(process.env.MAIL_PORT)
    this.username = String(process.env.MAIL_USERNAME)
    this.password = String(process.env.MAIL_PASSWORD)
    this.encryption = String(process.env.MAIL_ENCRYPTION)
  }
}

export default new EmailConfig();