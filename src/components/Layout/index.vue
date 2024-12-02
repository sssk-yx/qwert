<template>
    <div>
        <el-container class="container">
            <el-aside>
                <Aside />
            </el-aside>
            <el-container>
                <el-header>
                    <Tabbar />
                </el-header>
                <el-main>
                    <Main />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
let settingStore = useSettingStore();

</script>

<style scoped lang="scss">
:deep(.container) {
    .el-container {
        height: 100vh;
    }

    .el-aside {
        width: v-bind('settingStore.fold ? "64px" : "260px"');
        transition: width 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
        background-color: #001529;
        color: #fff;
    }

    .el-header {
        // background-color: #b3c0d1;
        color: #333;
        line-height: 60px;
    }

    .el-main {
        overflow: auto;
        // background-color: #e9eef3;
        color: #333;
    }
}
</style>