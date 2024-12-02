import App from "@/App.vue";
//引入路由
import router from './router';
//引入pinia
import pinia from './store'
//引入全局样式文件
import '@/styles/index.scss'
//引入element-plus暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)

//解决刷新导致动态路由丢失问题
let userStore = useUserStore();
userStore.generateUserAsyncRoutes()

app.use(router)

//使用自定义指令
import { isHasButton } from '@/directive/has'
isHasButton(app)

app.mount('#app');

