import type { GtCurrency } from '#/api/gt-api/models/gt-currency';

interface GtOrderInfoShipmentStatus {
  finished: number;
  pending: number;
}

export interface GtOrderInfo {
  company_name: string;
  currency: GtCurrency[];
  currency_id?: number;
  delivery_type: string;
  orders_no: string;
  phone: string;
  shipment_status?: GtOrderInfoShipmentStatus;
  transport_type: string;
}
