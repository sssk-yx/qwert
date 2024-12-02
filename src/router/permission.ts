//路由鉴权
//某一个路由什么条件下可以访问, 什么条件下不可以访问

import router from './index';
//引入nprgress和其样式
import NProgress from 'nprogress';
//取消加载时的转圈
NProgress.configure({ showSpinner: false });
import 'nprogress/nprogress.css';

let userStore = useUserStore();

//全局前置守卫
router.beforeEach(async (to, from) => {
    //开启进度条
    NProgress.start();
    if (userStore.token) {
        //已登录
        if (to.path === '/login') {
            return from.path;
        } else {
            return true;
        }
    } else {
        //未登录:只能访问登录页
        if (to.path === '/login') {
            return true;
        } else {
            return '/login'
        }
    }
})

//全局后置守卫
router.afterEach((to, from) => {

    //修改标签页标题
    document.title = `硅谷甄选-${to.meta.title as string || ''}`
    //关闭进度条
    NProgress.done();
})