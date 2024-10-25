import fetch from './handler';

export const getApplications = () => {
	// console.log(params)
	return fetch({
		method: 'GET',
		url: '/applications',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('token')
		}
	});
};
