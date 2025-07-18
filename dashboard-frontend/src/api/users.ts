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
	
	register: async (formData: { username: string; email: string; password: string; firstName: string; lastName: string}) => {
		const res = await httpClient.post('/users/auth/register', formData);
		return res.data; // { message: "Please confirm your email..." }
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
