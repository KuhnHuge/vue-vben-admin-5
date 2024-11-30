import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import * as models from '#/api/gt-api/models';
import { TokenApi } from '#/api/gt-api/tokenApi';

export class OrderApi extends TokenApi {
  public async exportProductClassInfo(
    year: number,
  ): Promise<models.GtCustomerPurchaseCategoryPercentage[] | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const body = { year };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtCustomerPurchaseCategoryPercentage[]>
    >('Member.Order/export_product_class_info', body, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
  public async exportProductMakeInfo(
    year: number,
  ): Promise<models.GtCustomerPurchaseBrandPercentage[] | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const body = { year };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtCustomerPurchaseBrandPercentage[]>
    >('Member.Order/export_product_make_info', body, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  public async getOrderInfo(
    input: models.GtGetOrderInfoInput,
  ): Promise<models.GtOrderInfo | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtOrderInfo>
    >('Member.Order/order_info', input, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
  public async orderItemList(
    input: models.GtGetOrderPageInput,
  ): Promise<models.GtPageModel<models.GtOrderItemDataModel> | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
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
  public async orderItemPlanList(
    order_id: number,
  ): Promise<models.GtOrderPlanItem[] | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtOrderPlanItem[]>
    >('Member.Order/order_item_plan_list', { order_id }, axiosRequestArgs);
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
      timeout: this.timeout,
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
      timeout: this.timeout,
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

  public async payDetailList(): Promise<
    models.GtPaymentInBalanceResult | undefined
  > {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtPaymentInBalanceResult>
    >('Member.Order/pay_detail_list', undefined, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
  public async purchasedProductList(
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
    >('Member.Order/purchased_product_list', input, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
  public async quotedProductList(
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
    >('Member.Order/quoted_product_list', input, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
  public async salesCompletionRate(
    year: number,
  ): Promise<models.GtCustomerSaleCompletion | undefined> {
    const options = {
      headers: this.headers,
      params: { XDEBUG_SESSION_START: this.debugParam },
      timeout: this.timeout,
    };
    const axiosRequestArgs: AxiosRequestConfig = {
      ...options,
    };
    const body = { year };
    const axiosResponse = await this.client.post<
      AxiosResponse<models.GtCustomerSaleCompletion>
    >('Member.Order/sales_completion_rate', body, axiosRequestArgs);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
}
