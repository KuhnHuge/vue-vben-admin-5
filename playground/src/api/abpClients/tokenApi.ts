import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH } from '@vben/constants';
import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { RequestClient } from '@vben/request';
import {
  type BasicUserInfo,
  resetAllStores,
  useAccessStore,
  useUserStore,
} from '@vben/stores';

import { message } from 'ant-design-vue';
import {
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import {
  AbpPasswordGetTokenModel,
  AbpRefreshTokenGetTokenModel,
  AbpTokenModel,
  AbpUserInfoModel,
} from '#/api/abpClients/tokenModels';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
} from '#/request/abp-interceptors';

const { abpUrl } = useAppConfig(import.meta.env, import.meta.env.PROD);

export class TokenApi {
  protected client: RequestClient;
  protected loginClient: RequestClient;
  private router;
  public loginLoading = false;
  constructor(client?: RequestClient) {
    this.loginClient = new RequestClient({ baseURL: abpUrl });
    this.loginClient.addResponseInterceptor(
      errorMessageResponseInterceptor((msg) => message.error(msg)),
    );
    this.client = client || new RequestClient({ baseURL: abpUrl });
    this.client.addRequestInterceptor({
      fulfilled: (config) => {
        const accessStore = useAccessStore();
        if (accessStore.accessToken) {
          config.headers.Authorization = this.formatToken(
            accessStore.accessToken,
          );
        }
        return config;
      },
    });
    this.client.addResponseInterceptor(
      authenticateResponseInterceptor({
        client: this.client,
        doReAuthenticate: this.doReAuthenticate,
        doRefreshToken: this.doRefreshToken,
        enableRefreshToken: preferences.app.enableRefreshToken,
        formatToken: this.formatToken,
      }),
    );
    this.client.addResponseInterceptor(
      errorMessageResponseInterceptor((msg) => message.error(msg)),
    );
    this.router = useRouter();
  }
  private formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  public async doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    // const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      resetAllStores();
      accessStore.setLoginExpired(false);

      // 回登陆页带上当前路由地址
      // await this.router.replace({
      //   path: LOGIN_PATH,
      //   query: {
      //     redirect: encodeURIComponent(this.router.currentRoute.value.fullPath),
      //   },
      // });
    }
  }

  public async doRefreshToken(): Promise<string> {
    const accessStore = useAccessStore();
    const refreshToken = accessStore.refreshToken;
    if (!refreshToken) {
      return '';
    }
    const abpTokenModelAxiosResponse = await this.getToken(
      new AbpRefreshTokenGetTokenModel(refreshToken),
    );
    if (!abpTokenModelAxiosResponse?.data) {
      return '';
    }
    accessStore.setAccessToken(abpTokenModelAxiosResponse.data.access_token);
    accessStore.setRefreshToken(abpTokenModelAxiosResponse.data.refresh_token);
    return abpTokenModelAxiosResponse.data.access_token;
  }

  public async getBasicUserInfo(): Promise<BasicUserInfo | undefined> {
    const userInfoResponse = await this.getUserInfo();
    if (!userInfoResponse?.data) {
      return undefined;
    }
    const userStore = useUserStore();
    // 创建实现该接口的对象
    const basicUserInfo: BasicUserInfo = {
      avatar: '',
      email: userInfoResponse.data.email,
      realName: userInfoResponse.data.given_name,
      roles: userInfoResponse.data.role,
      userId: userInfoResponse.data.sub,
      username: userInfoResponse.data.preferred_username,
    };
    userStore.setUserInfo(basicUserInfo);
    return basicUserInfo;
  }
  public async getToken(
    model: AbpPasswordGetTokenModel | AbpRefreshTokenGetTokenModel,
  ): Promise<AxiosResponse<AbpTokenModel>> {
    const headers = new AxiosHeaders();
    headers.setAccept('application/json');
    headers.setContentType('application/x-www-form-urlencoded');
    const options = {
      headers,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    return this.loginClient.post<AxiosResponse<AbpTokenModel>>(
      'connect/token',
      model,
      axiosRequestArgs,
    );
  }
  public async getUserInfo(): Promise<AxiosResponse<AbpUserInfoModel>> {
    return this.client.get<AxiosResponse<AbpUserInfoModel>>('connect/userinfo');
  }
  public async login(userName: string, password: string): Promise<void> {
    this.loginLoading = true;
    const tokenResponse = await this.getToken(
      new AbpPasswordGetTokenModel(userName, password),
    );
    this.loginLoading = false;
    if (!tokenResponse?.data) {
      return;
    }
    const accessStore = useAccessStore();
    accessStore.setAccessToken(tokenResponse.data.access_token);
    accessStore.setRefreshToken(tokenResponse.data.refresh_token);
    const basicUserInfo = await this.getBasicUserInfo();
    if (!basicUserInfo) {
      return;
    }
    await this.router.push(DEFAULT_HOME_PATH);
  }
}
