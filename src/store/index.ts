//引入pinia持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

//创建pinia
const pinia = createPinia();
//pinia持久化
pinia.use(piniaPluginPersistedstate);

//localStorage加密
import SecureLS from 'secure-ls'
import type { StorageLike } from 'pinia-plugin-persistedstate'
// encryptionSecret:自定义密钥
//isCompression:是否压缩
//encryptionSecret: 自定义密钥
const ls = new SecureLS({ isCompression: false, encryptionSecret: '38c31684-d00d-30dc-82e0-fad9eec46d1d' })

//自定义localStorage中数据读存的方式:对要存储的数据进行加密,读取时解密
export const st: StorageLike = {
    setItem(key: string, value: string) {
        ls.set(key, value)
    },
    getItem(key: string): string | null {
        return ls.get(key)
    }
}

//导出pinia
export default pinia;