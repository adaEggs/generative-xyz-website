export interface IMakeOrderPayload {
  details: Array<{
    id: string;
    qty: number;
  }>;
  name: string;
  email: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  source: string;
  wallet_address: string;
}

export interface IMakeOrderResponse {
  created_at: string;
  master_address: string;
  order_id: string;
  shipping_date: string;
  total: string;
}
