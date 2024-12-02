<template>
    <!-- 去除组件的div根标签可以解决"权限管理"和"商品管理"菜单项在菜单折叠时文字不消失的bug,原因未知 -->
    <template v-for="item in menuList" :key="item.path">
        <!-- 没有子路由的顶级路由 -->
        <el-menu-item v-if="!(item.children || item.meta.hidden)" :index="item.path">
            <el-icon>
                <Icon :icon="item.meta.icon" />
            </el-icon>
            <template #title>{{ item.meta.title }}</template>
        </el-menu-item>
        <!-- 有子路由但是只有一个子路由: 处理home页面的情况 -->
        <el-menu-item :index="item.children[0].path" v-if="item.children && item.children.length == 1">
            <el-icon>
                <Icon :icon="item.children[0].meta.icon" />
            </el-icon>
            <template #title>
                <span>{{ item.children[0].meta.title }}</span>
            </template>
        </el-menu-item>
        <!-- 嵌套路由 -->
        <el-sub-menu v-if="item.children && item.children.length > 1 && !item.meta.hidden" :index="item.path">
            <template #title>
                <el-icon>
                    <Icon :icon="item.meta.icon" />
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <Menu :menuList="item.children" />
        </el-sub-menu>
    </template>
</template>

<script setup lang="ts">
//由于将element-plus的所有组件图标进行了全局注册,其中包含<Menu>图标组件,unplugin-vue-components自动导入时全局组件优先级高于局部组件,显示导入<Menu/>组件以提高优先级
import Menu from './Menu.vue';
let props = defineProps(['menuList']);
</script>

<style lang="scss" scoped>
.iconify {
    font-size: 18px;
    margin-right: 5px;
}
</style>