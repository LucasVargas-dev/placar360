import axios, { isAxiosError } from 'axios';

export const api = axios.create({
	baseURL: '/api', // Vite proxy vai redirecionar para o backend
	headers: {
		'Content-Type': 'application/json',
	},
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');

	if (token != null) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
	(config) => config,
	(error) => {
		if (
			isAxiosError(error) &&
			error.response?.status === 401 &&
			window.location.pathname !== '/login'
		) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		throw error;
	}
);
