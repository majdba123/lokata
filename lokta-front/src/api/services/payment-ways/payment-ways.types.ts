export type PaymentWay = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  paymentway_input: PaymentWayInput[];
};

export type PaymentWayInput = {
  id: number;
  paymentway_id: number;
  type: string;
  name: string;
  created_at: string;
  updated_at: string;
};
