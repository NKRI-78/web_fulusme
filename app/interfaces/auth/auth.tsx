export interface AuthResponse {
  status: number;
  error: boolean;
  message: string;
  data: AuthDataResponse;
}

export interface AuthDataResponse {
  id: string;
  enabled: boolean;
  email: string;
  role: string;
  verify: boolean;
  token: string;
}
