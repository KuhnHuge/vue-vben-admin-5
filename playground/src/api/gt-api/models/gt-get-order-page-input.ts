import type { GtGetPageInput } from '#/api/gt-api/models/gt-get-page-input';

export interface GtGetOrderPageInput extends GtGetPageInput {
  orderId?: number;
}
