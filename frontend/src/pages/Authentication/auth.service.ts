import { api } from '../../services/api';
import { LoginRequest, LoginResponse, RegisterRequest } from './Auth';

export async function authLogin({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> {
  return await api
    .post<LoginResponse>('/auth/login', { email, password })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

export async function authRegister({
  email,
  password,
  name,
}: RegisterRequest): Promise<void> {
  return await api
    .post('/auth/register', { email, password, name })
    .then(() => undefined)
    .catch((error) => {
      throw error;
    });
}

