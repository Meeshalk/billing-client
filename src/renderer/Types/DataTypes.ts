export type User = {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  abilities?: Array<string>;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User;
  token: string;
};

export type LoginFormState = {
  email: string;
  password: string;
  device_name: string;
  isSubmitting: boolean;
  errorMessage: Array<string>;
};

export type LoginPayload = {
  user: User;
  token: string;
};

export type LogoutPayload = {
  user: object;
};

export type NewBillFormState = {
  customer_address: string;
  customer_mobile: string;
  customer_name: string;
  payment_type: string;
  isSubmitting: boolean;
  errorMessage: Array<string>;
};

export type ItemFormData = {
  name: string;
  quantity: string;
  rate: string;
  isSubmitting: boolean;
  errorMessage: Array<string>;
};

export type Invoice = {
  bill: Billing;
};

export type Billing = {
  id: string;
  user_id: string;
  customer_name?: string;
  customer_mobile?: string;
  customer_address?: string;
  total?: number;
  amount_payable?: number;
  payment_type?: string;
  is_complete: boolean;
  products_count?: number;
  item_count?: number;
  created_at?: string;
  updated_at?: string;
  products?: Array<Product>;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  rate: number;
  created_at?: string;
  updated_at?: string;
  pivot?: BillProduct;
};

export type BillProduct = {
  id: string;
  bill_id: string;
  product_id: string;
  quantity: number;
  amount: number;
  created_at?: string;
  updated_at?: string;
};

export type Action =
  | { type: 'login'; payload: LoginPayload }
  | { type: 'logout'; payload: LogoutPayload };
