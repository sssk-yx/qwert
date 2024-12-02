<template>
    <div>
        <router-link to="/home" class="router-link">
            <Logo />
        </router-link>
        <el-menu router :collapse="settingStore.fold" :default-active="$route.path" background-color="#001529"
            text-color="white">
            <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const settingStore = useSettingStore();
</script>

<style lang="scss" scoped>
/*清除菜单边框*/
.el-menu {
    border: 0;
}

/*清除roter-link组件默认样式*/
.router-link {
    text-decoration: none;

    &:link,
    &:active,
    &:visited,
    &:hover,
    &:focus {
        color: white;
    }
}
</style>