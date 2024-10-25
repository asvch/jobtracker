import axios from 'axios';
import { baseApiURL } from './base.ts';

export default function fetch(options) {
	return new Promise((resolve, reject) => {
		axios({
			url: `${baseApiURL}${options.url}`,
			method: options.method,
			headers: options.headers,
			params: options.params,
			data: options.body
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
