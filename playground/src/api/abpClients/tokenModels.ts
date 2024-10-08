export class AbpPasswordGetTokenModel {
  client_id: string = 'Admin_App';
  grant_type: string = 'password';
  password: string = '';
  scope: string = 'offline_access profile roles email Admin';
  username: string = '';

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class AbpRefreshTokenGetTokenModel {
  client_id: string = 'Admin_App';
  grant_type: string = 'refresh_token';
  refresh_token: string = '';
  scope: string = 'offline_access profile roles email Admin';

  constructor(refreshToken: string) {
    this.refresh_token = refreshToken;
  }
}

export class AbpTokenModel {
  access_token: string = '';
  expires_in: number = 0;
  refresh_token: string = '';
  scope: string = '';
  token_type: string = '';
}

export class AbpUserInfoModel {
  email: string = '';
  email_verified: boolean = false;
  family_name: null | string = null;
  given_name: string = '';
  preferred_username: string = '';
  role: string[] = [];
  sub: string = '';
  tenantid: null | string = null;
}
