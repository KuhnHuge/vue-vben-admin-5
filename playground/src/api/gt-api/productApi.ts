import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import * as models from '#/api/gt-api/models';
import { TokenApi } from '#/api/gt-api/tokenApi';

export class ProductApi extends TokenApi {
  public async productSearch(
    aikeyword: string,
    limit: number,
    page: number,
  ): Promise<models.GtProductSearchModel | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const body = { aikeyword, limit, page };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtProductSearchModel>
    >('Product.Product/list', body, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
}
