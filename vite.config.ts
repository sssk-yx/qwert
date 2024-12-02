import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

//Vue Devtools插件引入
import VueDevTools from 'vite-plugin-vue-devtools'

//组件、方法、图标按需自动引入
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from "unplugin-icons/loaders"
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

//src文件夹配置别名
import path from 'path'
//vite-plugin-mock插件引入
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  //获取环境变量文件夹
  let env = loadEnv(mode, process.cwd() + '/env');
  //小驼峰转小写并存入数组,用于自动导入pinia小仓库
  function camelToSnake(str) {
    let empStr = str.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
    return empStr.split('-')
  }

  return {
    //开发环境文件夹,相对于项目根目录
    envDir: "env",
    resolve: {
      //src文件夹别名配置
      alias: {
        "@": path.resolve("./src")
      }
    },
    plugins: [
      vue(),
      //vite-plugin-mock插件配置
      // VueDevTools(),
      AutoImport({
        //自动导入Vue相关函数
        imports: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox...
          ElementPlusResolver(),
          //自动导入图标组件定义: 图标名称格式: I(默认prefix前缀)+所属+图标名称
          IconsResolver(),
          //自动导入pinia仓库
          (name) => {
            if (name.startsWith('use') && name.endsWith('Store')) {
              return {
                name: name,
                //将小驼峰转小写并存入数组,用于自动导入pinia小仓库
                from: `@/store/${camelToSnake(name)[1]}`
              }
            }
          },
        ],
      }),
      Components({
        dirs: ['src/views', 'src/components'],
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动引入图标组件
          IconsResolver({
            customCollections: [
              'my-icons',
            ],
          }),
          //自定义解析器: 用于自动引入Icon组件
          (componentName) => {
            if (componentName === 'Icon')
              return { name: componentName, from: '@iconify/vue' }
          },
        ],
      }),

      Icons({
        autoInstall: true,
        customCollections: {
          // 加载该目录下所有svg图标
          'my-icons': FileSystemIconLoader("src/assets/icons"),
        }
      }),
      viteMockServe({
        localEnabled: command === 'serve',//保证开发阶段可以使用mock接口
      }),
    ],
    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
})

