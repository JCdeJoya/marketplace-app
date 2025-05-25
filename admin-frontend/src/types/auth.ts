export interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}