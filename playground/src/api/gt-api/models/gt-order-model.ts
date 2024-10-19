import type { GtOrderDataModel } from '#/api/gt-api/models/gt-order-data-model';

export interface GtOrderModel {
  data: GtOrderDataModel[];
  pageIndex: number;
  pageSize: number;
  total: number;
}
