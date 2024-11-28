import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import * as models from '#/api/gt-api/models';
import { TokenApi } from '#/api/gt-api/tokenApi';

export class CartApi extends TokenApi {
  public async addToCart(
    product_id: number,
    quantity: number,
  ): Promise<models.GtCommonMessageModel | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const body = { product_id, quantity };
    const axiosResponse = await this.client.post<models.GtCommonMessageModel>(
      'Customer.Cart/add_to_cart',
      body,
      axiosRequestArgs,
    );
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  public async cartList(
    input: models.GtGetPageInput,
  ): Promise<models.GtPageModel<models.GtProductItem> | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtPageModel<models.GtProductItem>>
    >('Customer.Cart/cart_list', input, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  public async removeFromCart(
    product_ids: string,
  ): Promise<models.GtCommonMessageModel | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const body = { product_ids };
    const axiosResponse = await this.client.post<models.GtCommonMessageModel>(
      'Customer.Cart/remove_from_cart',
      body,
      axiosRequestArgs,
    );
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  public async updateQuantity(
    product_id: number,
    quantity: number,
  ): Promise<models.GtCommonMessageModel | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const body = { product_id, quantity };
    const axiosResponse = await this.client.post<models.GtCommonMessageModel>(
      'Customer.Cart/edit_quantity',
      body,
      axiosRequestArgs,
    );
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
}
