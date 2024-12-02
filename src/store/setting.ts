
export const useSettingStore = defineStore('settingStore', {
    state: () => ({
        //侧边栏是否展开
        fold: false,
        //刷新按钮
        refresh: false,
    })
});

export default useSettingStore;
