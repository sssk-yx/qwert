<template>
    <div class="login_container">
        <el-row>
            <el-col :span="8" :offset="13">
                <el-form class="login_form" :model="loginForm" :rules="rules" hide-required-asterisk
                    label-position="right" label-width="auto" ref="loginFormRef">
                    <h1>Hello</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-form-item prop="username">
                        <template #label><span style="color:aliceblue">用户名</span></template>
                        <el-input v-model="loginForm.username" placeholder="请输入用户名">
                            <template #prefix>
                                <i-ep-user />
                            </template></el-input>
                    </el-form-item>
                    <el-form-item prop="password">

                        <template #label><span style="color:aliceblue">密码</span></template>
                        <el-input v-model="loginForm.password" placeholder="请输入密码" show-password>

                            <template #prefix>
                                <i-ep-lock />
                            </template></el-input>
                    </el-form-item>
                    <el-form-item class="make-button-center">
                        <el-button type="primary" color="#444FC5" @click="login" :loading="loading">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
//引入获取时间函数
import getTime from '@/utils/time';
let userStore = useUserStore();
let $router = useRouter();

//表单数据
const loginForm = ref({
    username: 'admin',
    password: '111111'
})
//表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'change' }]
}

//登录按钮加载效果
let loading = ref(false);
//表单校验通过之后发起登录请求
const loginFormRef = ref();
const login = async () => {
    //验证表单
    await loginFormRef.value.validate();
    //开启登录按钮加载效果
    loading.value = true;
    try {
        await userStore.userLogin(loginForm.value);
        $router.push('/');
        ElNotification({
            title: '欢迎回来',
            message: `Hi,${getTime()}好`,
            type: 'success'
        });
    } catch (e) {
        ElNotification({
            title: '登录失败 ',
            message: e,
            type: 'error'
        });
    } finally {
        //关闭登录按钮加载效果
        loading.value = false;
    }
}
</script>

<style scoped lang="scss">
.login_container {
    width: 100vw;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login_form {
        position: relative;
        top: 30vh;
        padding: 20px;
        border-radius: 15px;
        background: url('@/assets/images/login_form.png') no-repeat;

        h1 {
            font-size: 40px;
            color: white;
        }

        h2 {
            margin: 20px 0;
            font-size: 20px;
            color: white;
        }
    }
}

//ep组件样式修改
:deep {
    .make-button-center {
        justify-content: center;

        .el-form-item__content {
            flex: 0 1 auto;
            margin-left: 0 !important;
            width: 60px;
        }
    }
}
</style>