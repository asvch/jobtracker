import axios from 'axios';
import { baseApiURL } from './base.ts';

/**
 * Makes an HTTP request using axios with the given options.
 * Automatically adds an Authorization header if a token is stored in localStorage.
 * Redirects to the home page and removes the token from localStorage if a 401 status is encountered.
 *
 * @param {Object} options - The options for the HTTP request.
 * @param {string} options.url - The URL for the request.
 * @param {string} [options.method='GET'] - The HTTP method for the request.
 * @param {Object} [options.headers={}] - The headers for the request.
 * @param {Object} [options.params] - The URL parameters for the request.
 * @param {Object} [options.body] - The body data for the request.
 * @param {boolean} [options.raw=false] - If true, the response type will be 'arraybuffer'.
 * @returns {Promise<Object>} A promise that resolves with the response data or rejects with an error.
 */
export default function fetchs(options) {
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
