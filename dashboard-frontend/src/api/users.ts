import httpClient from './httpClient';

export const api = {
	getUser: async (id: string) => {
		const res = await httpClient.get(`/users/${id}`);
		return res.data;
	},

	updateUser: async (id: string, data: any) => {
		const res = await httpClient.put(`/users/${id}`, data);
		return res.data;
	},

	login: async (credentials: { email: string; password: string }) => {
		const res = await httpClient.post('/users/auth/login', credentials, {
			withCredentials: true, // include cookies
		});
		return res.data;
	},

	logout: async () => {
		return await httpClient.post('/users/auth/logout', {}, {
			withCredentials: true,
		});
	},
};
