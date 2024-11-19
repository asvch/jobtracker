import fetchs from './handler';


// export const getToken = (params) => { 
// 	return fetch('http://localhost:5000/users/login', 
// 		{ method: 'POST', 
// 		headers: { 'Content-Type': 'application/json' }, 
// 		body: JSON.stringify(params) }); };

// export const getToken = (params) => {
// 	// console.log(params)
// 	return fetchs({
// 		method: 'POST',
// 		url: '/users/login',
// 		body: params
// 	});
// };

export const getToken = (params) => { 
    return fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    })
    .then(response => response.json())  // Convert to JSON
    .catch(error => {
        console.error("Error in fetch:", error);
        throw error;
    });
};

export const signUp = (params) => { 
	return fetch('http://localhost:5000/users/signup', 
		{ method: 'POST', 
		headers: { 'Content-Type': 'application/json' }, 
		body: JSON.stringify(params) }); };

// export const signUp = (params) => {
// 	return fetchs({
// 		method: 'POST',
// 		// url: '/users/signup',
// 		url: 'http://localhost:5000/users/signup',
// 		body: params
// 	});
// };

export const storeToken = (obj) => {
    // Converting userId to string to possibly solve that error about undefined or something
    const userId = obj.userId ? obj.userId.toString() : null;
	localStorage.setItem('token', obj.token);
	localStorage.setItem('expiry', obj.expiry);
	localStorage.setItem('userId', userId);
};
