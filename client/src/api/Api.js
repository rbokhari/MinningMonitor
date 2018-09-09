//import axios from 'vue-resource';

const  API_URL = 'http://46.101.227.146:3000/api/v1/'; // 'http://192.168.1.2:3090';  

class Api {
    
    static get(url, params = {}) {
        const headers = {
            'authorization': localStorage.getItem('token'),
            'CompanyId': localStorage.getItem('companyId'),
        };
        const data = params;
        return fetch(`${API_URL}${url}`, {
            method: 'get',
            headers: headers,
            params: data
        });
    }

    static post(url, data) {
        const headers = {
            'Content-Type': 'application/json',
            'authorization': '', // localStorage.getItem('token'),
            'CompanyId': 1 //localStorage.getItem('companyId')
        };
        const params = Object.assign( {}, data );
        return fetch(`${API_URL}${url}`, {
            method: 'post', 
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    static put(url, data) {
        const headers = {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token'),
            'CompanyId': localStorage.getItem('companyId'),
        };
        console.info(`${API_URL}${url}`, data);
        const params = Object.assign( {}, data );
        return fetch(`${API_URL}${url}`, {
            method: 'put',
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    static patch(url, data) {
        const headers = {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token'),
            'CompanyId': localStorage.getItem('companyId'),
        };
        console.info(`${API_URL}/${url}`);
        const params = Object.assign( {}, data );
        return fetch(`${API_URL}${url}`, {
            method: 'patch',
            headers: headers,
            body: JSON.stringify(data)
        });
    }

}

export default Api;