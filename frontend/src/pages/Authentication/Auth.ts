// Types and Interfaces for Authentication

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface RegisterResponse {
  message?: string;
}

