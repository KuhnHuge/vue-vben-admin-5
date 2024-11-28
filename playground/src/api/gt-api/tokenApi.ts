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
// import {
//   AbpPasswordGetTokenModel,
//   AbpRefreshTokenGetTokenModel,
//   AbpTokenModel,
//   AbpUserInfoModel,
// } from '#/api/abpClients/tokenModels';
import {
  GtGetTokenModel,
  type GtMemberResult,
  type GtTokenModel,
} from '#/api/gt-api/models';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
} from '#/request/gtInterceptors';

const { dlzURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

export class TokenApi {
  protected client: RequestClient;
  protected debugParam: string;
  protected headers = new AxiosHeaders();
  protected loginClient: RequestClient;
  protected timeout: number;
  private router;
  public loginLoading = false;
  constructor(client?: RequestClient) {
    this.timeout = 1000 * 60 * 10;
    this.debugParam = '17065';
    this.loginClient = new RequestClient({ baseURL: dlzURL });
    this.loginClient.addResponseInterceptor(
      errorMessageResponseInterceptor((msg) => message.error(msg)),
    );
    this.client = client || new RequestClient({ baseURL: dlzURL });
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
        enableRefreshToken: false, // preferences.app.enableRefreshToken,
        formatToken: this.formatToken,
      }),
    );
    this.client.addResponseInterceptor(
      errorMessageResponseInterceptor((msg) => message.error(msg)),
    );
    this.router = useRouter();
    this.headers.set('Uuid', '52999f567fdfb3181c141bc0108a4785');
    this.headers.set('x-application-name', 'dlz');
  }
  private formatToken(token: null | string) {
    return token ?? null;
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
    // const accessStore = useAccessStore();
    // const refreshToken = accessStore.refreshToken;
    // if (!refreshToken) {
    //   return '';
    // }
    // const abpTokenModelAxiosResponse = await this.getToken(
    //   new AbpRefreshTokenGetTokenModel(refreshToken),
    // );
    // if (!abpTokenModelAxiosResponse?.data) {
    //   return '';
    // }
    // accessStore.setAccessToken(abpTokenModelAxiosResponse.data.access_token);
    // accessStore.setRefreshToken(abpTokenModelAxiosResponse.data.refresh_token);
    // return abpTokenModelAxiosResponse.data.access_token;
    return '';
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
      email: userInfoResponse.data.data.email,
      realName: userInfoResponse.data.data.username,
      roles: ['user'],
      userId: userInfoResponse.data.data.member_id,
      username: userInfoResponse.data.data.username,
    };
    userStore.setUserInfo(basicUserInfo);
    return basicUserInfo;
  }
  public async getToken(
    model: GtGetTokenModel,
  ): Promise<AxiosResponse<GtTokenModel>> {
    this.headers.setAccept('application/json');
    this.headers.setContentType('application/x-www-form-urlencoded');
    const options = {
      headers: this.headers,
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    return this.loginClient.post<AxiosResponse<GtTokenModel>>(
      'Member.Member/login',
      model,
      axiosRequestArgs,
    );
  }
  public async getUserInfo(): Promise<AxiosResponse<GtMemberResult>> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    return this.client.get<AxiosResponse<GtMemberResult>>(
      'Member.Member/info',
      axiosRequestArgs,
    );
  }
  // public async login(userName: string, password: string): Promise<void> {
  //   this.loginLoading = true;
  //   const tokenResponse = await this.getToken(
  //     new AbpPasswordGetTokenModel(userName, password),
  //   );
  //   this.loginLoading = false;
  //   if (!tokenResponse?.data) {
  //     return;
  //   }
  //   const accessStore = useAccessStore();
  //   accessStore.setAccessToken(tokenResponse.data.access_token);
  //   accessStore.setRefreshToken(tokenResponse.data.refresh_token);
  //   const basicUserInfo = await this.getBasicUserInfo();
  //   if (!basicUserInfo) {
  //     return;
  //   }
  //   await this.router.push(DEFAULT_HOME_PATH);
  // }
  public async login(userName: string, password: string): Promise<void> {
    this.loginLoading = true;
    const getTokenModel = new GtGetTokenModel(userName, password);
    const tokenResponse = await this.getToken(getTokenModel);
    this.loginLoading = false;
    if (!tokenResponse?.data) {
      return;
    }
    const accessStore = useAccessStore();
    accessStore.setAccessToken(tokenResponse.data.token);

    const userStore = useUserStore();
    const basicUserInfo: BasicUserInfo = {
      avatar: '',
      email: tokenResponse.data.data.email,
      realName: tokenResponse.data.data.username,
      roles: ['user'],
      userId: tokenResponse.data.data.member_id,
      username: tokenResponse.data.data.username,
    };
    userStore.setUserInfo(basicUserInfo);
    await this.router.push(DEFAULT_HOME_PATH);
  }
}
