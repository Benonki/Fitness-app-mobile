import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.16:3000', // npx json-server db.json
    timeout: 3000,
});

export default axiosInstance;