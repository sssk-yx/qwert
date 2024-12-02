<template>
    <div class="container">
        <!-- 顶部左侧 -->
        <div class="tabbar_left">
            <Icon :icon="settingStore.fold === false ? 'ep:expand' : 'ep:fold'"
                @click="settingStore.fold = !settingStore.fold"
                style=" margin-right:10px;font-size:25px; cursor: pointer;" />
            <!-- 面包屑 -->
            <el-breadcrumb separator-icon="ArrowRightBold">
                <!-- v-if优先级高于v-for,用v-show代替 -->
                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path" v-show="item.meta.title"
                    :to="item.path">
                    <Icon :icon="item.meta.icon as string" />
                    {{ item.meta.title }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 顶部右侧 -->
        <div class="tabbar_right">
            <!-- 设置 -->
            <el-button icon="Refresh" circle @click="settingStore.refresh = !settingStore.refresh"></el-button>
            <el-button icon="FullScreen" circle @click="fullScreen"></el-button>
            <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
                <el-form>
                    <el-form-item label="主题颜色">
                        <el-color-picker v-model="color" @change="setColor" />
                    </el-form-item>
                    <el-form-item label="暗黑模式">
                        <el-switch inline-prompt v-model="dark" active-icon="MoonNight" inactive-icon="Sunny"
                            @change="changeDark" />
                    </el-form-item>
                </el-form>
                <template #reference>
                    <el-button icon="Setting" circle></el-button>
                </template>
            </el-popover>
            <!-- 头像和用户名 -->
            <img :src="userStore.userInfo.avatar" class="headPortrait" />
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ userStore.userInfo.name }}<i-ep:arrow-down class="el-icon--right" />
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="userLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
let settingStore = useSettingStore();
let userStore = useUserStore();
let $router = useRouter();
let $route = useRoute();

// 全屏按钮点击回调
const fullScreen = () => {
    // 判断是否全屏
    if (document.fullscreenElement) {
        // 退出全屏
        document.exitFullscreen();
    } else {
        // 进入全屏
        document.documentElement.requestFullscreen();
    }
};

// 退出登录
const userLogout = async () => {
    await userStore.userLogout();
    //提示退出登录成功
    ElNotification({
        title: '提示',
        message: `退出登录成功`,
        type: 'success'
    });
    //跳转之前已经清空token,相当于未登录状态,可以跳转至登录页
    $router.push('/login');
};
//颜色选择器所选颜色
let color = ref('#409EFF')
//改变主题颜色
const setColor = (val: string) => {
    //改变主题颜色
    document.documentElement.style.setProperty('--el-color-primary', val)
}

//开关状态
let dark = ref(false)
//开关状态改变回调
const changeDark = (val: boolean) => {
    if (val) {
        //暗黑模式
        document.documentElement.classList.add('dark')
    } else {
        //非暗黑模式
        document.documentElement.classList.remove('dark')
    }
}
</script>

<style scoped lang="scss">
@mixin flexCenter() {
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items: center;
}

.container {

    &,
    .tabbar_left,
    .tabbar_right {
        @include flexCenter();
    }

    :deep(.el-breadcrumb) {
        font-size: 16px;
        color: #8a8b8d;
    }

    .tabbar_right {
        .headPortrait {
            width: 40px;
            height: 40px;
            margin-left: 15px;
            margin-right: 5px;
            border-radius: 50%;
        }

        .el-dropdown {
            vertical-align: top;
        }

        .el-dropdown-link {
            cursor: pointer;
            font-size: 16px;
            font-size: black;
            vertical-align: top;

            .el-icon--right {
                position: relative;
                top: 5px;
                margin-left: 0;
            }
        }
    }
}

.iconify {
    vertical-align: -3px;
    font-size: 18px;
    margin-right: 2px;
}
</style>