//Axios二次封装
import axios from 'axios';

import useUserStore from '@/store/user';
import router from '@/router'

//创建Axios实例
let request = axios.create({
    //请求基地址使用的是环境变量
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000 //超时时间为5秒
})
//请求拦截器
request.interceptors.request.use(config => {
    //获取token
    let token = useUserStore().token;
    //判断token是否存在
    if (token) {
        //设置请求头
        config.headers.token = token;
    }
    return config;
});
//响应拦截器
request.interceptors.response.use(async response => {

    //token失效跳转至登录页面
    if (response.data.code === 401) {
        await useUserStore().userLogout();
        router.push(`/login?redirect=${router.currentRoute.value.path}`);
    }
    //返回data数据
    return response.data;
}, (error) => {
    //处理网络错误
    let msg = '';
    let status = error.response.status;
    switch (status) {
        case 401:
            msg = "token过期";
            break;
        case 403:
            msg = '无权访问';
            break;
        case 404:
            msg = "请求地址错误";
            break;
        case 500:
            msg = "服务器出现问题";
            break;
        default:
            msg = "无网络";

    }
    ElMessage({
        type: 'error',
        message: msg
    })
    return Promise.reject(error);
});
export default request;