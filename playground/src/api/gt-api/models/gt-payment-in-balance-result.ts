export interface GtPaymentInBalance {
  amount: string;
  amount_rmb: string;
  bill_amount: string;
  create_time: string;
  exchange_rate: string;
  left_amount: string;
  remark: string;
  seq: string;
}

export interface GtPaymentInBalanceResult {
  left_amount: number;
  list: GtPaymentInBalance[];
}
