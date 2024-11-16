import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import * as models from '#/api/gt-api/models';
import { TokenApi } from '#/api/gt-api/tokenApi';

export class OrderApi extends TokenApi {
  public async orderItemList(
    input: models.GtGetOrderPageInput,
  ): Promise<models.GtPageModel<models.GtOrderItemDataModel> | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtPageModel<models.GtOrderItemDataModel>>
    >('Member.Order/order_item_list', input, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  public async orderList(
    input: models.GtGetPageInput,
  ): Promise<models.GtOrderModel | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
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

  public async orderShipmentList(
    input: models.GtGetPageInput,
  ): Promise<models.GtOrderModel | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtOrderModel>
    >('Member.Order/order_shipment_list', input, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
}