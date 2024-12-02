<template>
    <div class="container">
        <img src="/logo.png" />
        <Transition name="p">
            <p v-if="!settingStore.fold">硅谷甄选运营平台</p>
        </Transition>
    </div>
</template>

<script setup lang="ts">
let settingStore = useSettingStore();
</script>

<style scoped lang="scss">
.container {
    display: flex;
    width: 100%;
    height: 50px;
    margin-top: 7px;
    align-items: center;
    justify-content: center;

    img {
        width: 45px;
    }

    p {
        margin-left: 5px;
        font-size: 20px;
        font-weight: 700;
    }
}

.p-enter-active {
    transition: all 0.3s;
    display: none;
}
</style>