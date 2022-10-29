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

export type Action =
  | { type: 'login'; payload: LoginPayload }
  | { type: 'logout'; payload: LogoutPayload };
