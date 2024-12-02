<template>
    <div>
        <el-card>
            <div class="box">
                <img :src="userStore.userInfo.avatar" alt="" class="avatar">
                <div class="bottom">
                    <h3 class="title">你好呀{{ userStore.userInfo.name }}</h3>
                    <p class="subtitle">硅谷甄选运营平台</p>
                </div>
            </div>
        </el-card>
        <div class="bottoms">
            <i-my-icons:welcome name="welcome" width="600px" height="300px"></i-my-icons:welcome>
        </div>
    </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/user';
//获取存储用户信息的仓库对象
let userStore = useUserStore();

</script>

<style scoped lang="scss">
.box {
    display: flex;

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .bottom {
        margin-left: 20px;

        .title {
            font-size: 30px;
            font-weight: 900;
            margin-bottom: 30px;
        }

        .subtitle {
            font-style: italic;
            color: skyblue;
        }
    }
}

.bottoms {
    margin-top: 100px;
    display: flex;
    justify-content: center;
}
</style>