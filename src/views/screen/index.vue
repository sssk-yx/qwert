<template>
    <div class="container">
        <div class="screen" ref="screen">
            <div class="top">
                <Top />
            </div>
            <div class="bottom">
                <div class="left">
                    <Tourist class="tourist"></Tourist>
                    <Sex class="sex"></Sex>
                    <Age class="age"></Age>
                </div>
                <div class="center">
                    <Map class="map"></Map>
                    <Line class="line"></Line>
                </div>
                <div class="right">
                    <Rank class="rank"></Rank>
                    <Year class="year"></Year>
                    <Counter class="count"></Counter>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
//大屏适配
//获取数据大屏展示内容盒子的DOM元素
const screen = ref();
//计算大屏缩放比例
function getScale(w = 1920, h = 1080) {
    //使用水平和垂直方向中较小的缩放比例作为两个方向的缩放比例
    return Math.min(window.innerWidth / w, window.innerHeight / h);
}
//在元素挂载后立即进行一次缩放和复位
onMounted(() => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
});
//在窗口大小改变时进行缩放和复位
window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
}

//引入顶部的子组件
import Top from './components/top/index.vue';
//引入左侧三个子组件
import Tourist from './components/tourist/index.vue';
import Sex from './components/sex/index.vue';
import Age from './components/age/index.vue'

//引入中间两个子组件
import Map from './components/map/index.vue';
import Line from './components/line/index.vue';

//引入右侧三个子组件
import Rank from './components/rank/index.vue';
import Year from './components/year/index.vue';
import Counter from './components/couter/index.vue'
</script>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    background-image: url(./images/bg.png);
    background-size: cover;

    .screen {
        /* 使用固定定位,将内容展示盒子左上角移到屏幕中心, 然后使用transform进行缩放和复位 */
        position: fixed;
        width: 1920px;
        height: 1080px;
        left: 50%;
        top: 50%;
        /* transform的基准点设置为盒子左上角 */
        transform-origin: left top;

        .top {
            width: 100%;
            height: 40px;
        }

        .bottom {
            display: flex;

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-left: 40px;

                .rank {
                    flex: 1.5;
                }

                .year {
                    flex: 1;

                }

                .count {
                    flex: 1;
                }
            }

            .left {
                flex: 1;
                height: 1040px;
                display: flex;
                flex-direction: column;

                .tourist {
                    flex: 1.2;
                }

                .sex {
                    flex: 1;

                }

                .age {
                    flex: 1;
                }
            }

            .center {
                flex: 1.5;
                display: flex;
                flex-direction: column;

                .map {
                    flex: 4;
                }

                .line {
                    flex: 1;
                }
            }
        }
    }
}
</style>