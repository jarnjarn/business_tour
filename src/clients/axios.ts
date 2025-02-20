import axios from "axios";
import {message} from "antd";
import {CookieUtil} from "@/common/utils/cookie.util";


const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST+"/",
    headers: {
        'Content-Type': 'application/json'
    }
});
axiosClient.interceptors.request.use(async (config) => {
    if (config.params) {
        Object.keys(config.params).forEach((key) => {
            if (config.params[key] === -1 || config.params[key] === '' || config.params[key] === null || config.params[key] === undefined || config.params[key] === 'undefined' || config.params[key] === 'null') {
                delete config.params[key];
            }
        })

    }
    // remove -1 and '' in query
    if (typeof window !== 'undefined') {

        if (typeof window !== 'undefined') {
            const token = CookieUtil.getCookie('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            const longitude = CookieUtil.getCookie('longitude');
            const latitude = CookieUtil.getCookie('latitude');
            if (longitude && latitude) {
                config.headers.longitude = longitude;
                config.headers.latitude = latitude;
            }
        }

    }
    else {
        const { cookies } = require('next/headers');
        const cookiesStore = cookies();
        const token = cookiesStore.get('token');
        const longitude = cookiesStore.get('longitude');
        const latitude = cookiesStore.get('latitude');
        if (token) {
            config.headers.Authorization = `Bearer ${token.value}`;
        }
        if (longitude && latitude) {
            config.headers.longitude = longitude.value;
            config.headers.latitude = latitude.value;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})
axiosClient.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    if (typeof window !== 'undefined') {
        if (error?.response?.data?.code && error?.response?.data?.message && error?.response?.data?.status) {
            message.error(error.response.data?.message)
        }

        return Promise.reject(error.response.data);
    }
    else {
        return Promise.reject(error);
    }
})



export default axiosClient