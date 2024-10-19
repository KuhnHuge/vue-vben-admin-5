import type {
  MakeErrorMessageFn,
  RequestClient,
  ResponseInterceptorConfig,
} from '@vben/request';

import { $t } from '@vben/locales';

import axios from 'axios';

export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn,
): ResponseInterceptorConfig => {
  return {
    rejected: (error: any) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      let errorMessage =
        error?.response?.data?.msg ??
        error?.response?.data?.message ??
        error?.response?.data?.error_message ??
        error?.response?.data?.error_description ??
        error?.response?.data?.error?.details ??
        error?.response?.data?.error?.message ??
        '';
      if (errorMessage) {
        makeErrorMessage?.(errorMessage, error);
        if (error?.response) {
          error.response.data = null;
        }
        return error?.response ?? null;
        // return Promise.reject(error);
      }
      const status = error?.response?.status;

      switch (status) {
        case 400: {
          errorMessage = $t('fallback.http.badRequest');
          break;
        }
        case 401: {
          errorMessage = $t('fallback.http.unauthorized');
          break;
        }
        case 403: {
          errorMessage = $t('fallback.http.forbidden');
          break;
        }
        case 404: {
          errorMessage = $t('fallback.http.notFound');
          break;
        }
        case 408: {
          errorMessage = $t('fallback.http.requestTimeout');
          break;
        }
        default: {
          errorMessage = $t('fallback.http.internalServerError');
        }
      }
      makeErrorMessage?.(errorMessage, error);
      if (error?.response) {
        error.response.data = null;
      }
      return error.response;
      // return Promise.reject(error);
    },
  };
};

export const authenticateResponseInterceptor = ({
  client,
  doReAuthenticate,
  doRefreshToken,
  enableRefreshToken,
  formatToken,
}: {
  client: RequestClient;
  doReAuthenticate: () => Promise<void>;
  doRefreshToken: () => Promise<string>;
  enableRefreshToken: boolean;
  formatToken: (token: string) => null | string;
}): ResponseInterceptorConfig => {
  return {
    rejected: async (error) => {
      const { config, response } = error;
      // 如果不是 401 错误，直接抛出异常
      if (response?.status !== 401) {
        throw error;
      }
      // 判断是否启用了 refreshToken 功能
      // 如果没有启用或者已经是重试请求了，直接跳转到重新登录
      if (!enableRefreshToken || config.__isRetryRequest) {
        await doReAuthenticate();
        throw error;
      }
      // 如果正在刷新 token，则将请求加入队列，等待刷新完成
      if (client.isRefreshing) {
        return new Promise((resolve) => {
          client.refreshTokenQueue.push((newToken: string) => {
            config.headers.Authorization = formatToken(newToken);
            resolve(client.request(config.url, { ...config }));
          });
        });
      }

      // 标记开始刷新 token
      client.isRefreshing = true;
      // 标记当前请求为重试请求，避免无限循环
      config.__isRetryRequest = true;

      try {
        const newToken = await doRefreshToken();
        if (!newToken) {
          await doReAuthenticate();
        }

        // 处理队列中的请求
        client.refreshTokenQueue.forEach((callback) => callback(newToken));
        // 清空队列
        client.refreshTokenQueue = [];

        return client.request(error.config.url, { ...error.config });
      } catch (refreshError) {
        // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
        client.refreshTokenQueue.forEach((callback) => callback(''));
        client.refreshTokenQueue = [];
        console.error('Refresh token failed, please login again.');
        await doReAuthenticate();

        throw refreshError;
      } finally {
        client.isRefreshing = false;
      }
    },
  };
};

// export const authRequestInterceptor = (): RequestInterceptorConfig => {};
