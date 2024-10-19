export class GtGetTokenModel {
  password: string;
  username: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
