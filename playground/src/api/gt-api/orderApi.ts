import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import * as models from '#/api/gt-api/models';
import { TokenApi } from '#/api/gt-api/tokenApi';

export class OrderApi extends TokenApi {
  public async orderList(
    input: models.GtGetPageInput,
  ): Promise<models.GtOrderModel | undefined> {
    const options = {
      headers: this.headers,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtOrderModel>
    >('Member.Order/order_list', input, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
}
