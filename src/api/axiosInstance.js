import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.16:3000/api',
    timeout: 5000,
});

let temporaryToken = null;

axiosInstance.interceptors.request.use(async (config) => {
    let token = await SecureStore.getItemAsync('userToken');
    if (!token && temporaryToken) {
        token = temporaryToken;
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const setTemporaryToken = (token) => {
    temporaryToken = token;
};

export default axiosInstance;