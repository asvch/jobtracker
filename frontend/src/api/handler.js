import axios from 'axios';
import { baseApiURL } from './base.ts';

export default function fetch(options) {
	return new Promise((resolve, reject) => {
		const headers = options.headers || {};

		if (!headers.Authorization && localStorage.getItem('token') && options.url !== '/users/login') {
			headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
		}

		axios({
			url: `${baseApiURL}${options.url}`,
			method: options.method,
			headers,
			params: options.params,
			data: options.body,
			responseType: options.raw ? 'arraybuffer' : undefined
		})
			.then((response) => {
				resolve(response.data);
			})
			.catch((e) => {
				if (e.status === 401) {
					window.location.href = '/';
					localStorage.removeItem('token');
				}
				reject(e);
			});
	});
}
