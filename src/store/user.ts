//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//引入自定义storage,用于加密持久化数据
import { st } from './index'
//引入路由
import { constantRoutes, asyncRoutes } from '@/router/routes'
//引入深拷贝函数
import cloneDeep from 'lodash/cloneDeep'

import router from '@/router'
export let resRoute = [];
//过滤当前用户的动态路由
function filterAsyncRoutes(asyncRoutesCopies, routes) {
    return asyncRoutesCopies.filter(route => {
        if (routes.includes(route.name)) {
            if (route.children) {
                route.children = filterAsyncRoutes(route.children, routes);
            }
            return true;
        }
    });
}

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        // menuRoutes,//生成菜单所需的路由
        userInfo: {
            routes: [],
            buttons: [],
            roles: [],
            name: '',
            avatar: ''
        },
        menuRoutes: [],
    }),
    actions: {
        //用户登录
        async userLogin(data) {
            let result = await reqLogin(data);
            if (result.code === 200) {
                this.token = result.data;
                this.getUserInfo();
                return 'ok'
            } else {
                return Promise.reject(result.data)
            }
        },
        //过滤动态路由并添加进路由列表中
        generateUserAsyncRoutes() {
            //计算当前用户所需的动态路由
            const userAsyncRoutes = filterAsyncRoutes(
                cloneDeep(asyncRoutes),
                this.userInfo.routes,
            )
            //将过滤后的动态路由添加进路由列表中
            userAsyncRoutes.forEach(route => {
                router.addRoute(route)
            })
        },
        //获取用户信息
        async getUserInfo() {
            let result = await reqUserInfo();
            if (result.code === 200) {
                //将用户信息存储到小仓库
                this.userInfo = result.data;
                //过滤动态路由并添加进路由列表中
                this.generateUserAsyncRoutes();
                //计算当前用户所需的动态路由
                const userAsyncRoutes = filterAsyncRoutes(
                    cloneDeep(asyncRoutes),
                    this.userInfo.routes,
                )
                //将过滤后的动态路由添加进菜单所需路由中
                this.menuRoutes = [...constantRoutes, ...userAsyncRoutes];
                return 'ok'
            } else {
                return Promise.reject(result.data)
            }
        },

        //退出登录
        async userLogout() {
            //发送请求
            await reqLogout();
            //清空token
            this.token = '';
            //清空用户信息
            this.userInfo = {
                routes: [],
                buttons: [],
                roles: [],
                name: '',
                avatar: ''
            },
                this.menuRoutes = [];
        }
    },
    //持久化
    persist: {

    }
})

export default useUserStore;
