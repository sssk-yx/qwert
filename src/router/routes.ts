import { RouteRecordRaw } from "vue-router";

//常量路由
//<Array<RouteRecordRaw>>解决TS报错,原理未知
export const constantRoutes = <Array<RouteRecordRaw>>[
    {
        //登录页
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login',
        meta: {
            hidden: true
        }
    },
    {
        //登录后跳转至首页
        path: '/',
        component: () => import('@/components/Layout/index.vue'),
        name: 'layout',
        redirect: '/home',
        meta: {
            //将此路由的子路由全部设为顶级菜单
            topLevelMenu: true
        },
        children: [
            {
                //首页
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'ep:home-filled',
                }
            },

        ]
    },
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'screen',
        meta: {
            title: '数据大屏',
            icon: 'ep:platform'
        }
    },
    {
        //404
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            hidden: true
        }
    },
    {
        //都不匹配时重定向至404页面
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'any',
        meta: {
            hidden: true
        }
    }
]

//动态路由
export const asyncRoutes = <Array<RouteRecordRaw>>[
    {
        path: '/acl',
        name: 'Acl',
        redirect: '/acl/role',
        component: () => import('@/components/Layout/index.vue'),
        meta: {
            title: '权限管理',
            icon: 'ep:lock'
        },
        children: [
            {
                path: '/acl/role',
                name: 'Role',
                component: () => import('@/views/acl/role/index.vue'),
                meta: {
                    title: '角色管理',
                    icon: 'ep:user-filled'
                }
            },
            {
                path: '/acl/user',
                name: 'User',
                component: () => import('@/views/acl/user/index.vue'),
                meta: {
                    title: '用户管理',
                    icon: 'ep:user'
                }
            },
            {
                path: '/acl/permission',
                name: 'Permission',
                component: () => import('@/views/acl/permission/index.vue'),
                meta: {
                    title: '菜单管理',
                    icon: 'ep:monitor'
                }
            },
        ]
    },
    {
        path: '/product',
        name: 'Product',
        redirect: '/product/trademark',
        component: () => import('@/components/Layout/index.vue'),
        meta: {
            title: '商品管理',
            icon: 'ep:goods'
        },
        children: [
            {
                path: '/product/trademark',
                name: 'Trademark',
                component: () => import('@/views/product/Trademark.vue'),
                meta: {
                    title: '品牌管理',
                    icon: 'ep:shopping-cart-full'
                }
            },
            {
                path: '/product/attr',
                name: 'Attr',
                component: () => import('@/views/product/Attr/Attr.vue'),
                meta: {
                    title: '属性管理',
                    icon: 'ep:chrome-filled'
                }
            },
            {
                path: '/product/spu',
                name: 'Spu',
                component: () => import('@/views/product/SPU/index.vue'),
                meta: {
                    title: 'SPU管理',
                    icon: 'ep:calendar'
                }
            },
            {
                path: '/product/sku',
                name: 'Sku',
                component: () => import('@/views/product/SKU.vue'),
                meta: {
                    title: 'SKU管理',
                    icon: 'ep:orange'
                }
            }
        ]
    },
]



