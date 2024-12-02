<template>
    <div>
        <router-view v-slot="{ Component }">
            <transition>
                <component :is="Component" v-if="isPageShow" />
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
let settingStore = useSettingStore();
//监听刷新按钮状态,状态转换代表被点击,重新加载页面
let isPageShow = ref(true);
watch(() => settingStore.refresh, () => {
    isPageShow.value = false;
    nextTick(() => {
        isPageShow.value = true;
    });
});
</script>

<style lang="scss" scoped>
/*组件过渡效果*/
.v-enter-active,
.v-leave-active {
    transition: all 1s;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

/*防止组件切换时的闪烁*/
.v-leave-to {
    display: none;
}
</style>