import axios from "axios";

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_MOVIES_API_BASE_URL,
	headers: {
		"X-API-KEY": import.meta.env.VITE_MOVIES_API_KEY,
	},
});
