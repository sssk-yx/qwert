//封装一个函数, 获取一个结果: 当前早上|上午|下午|晚上
export default () => {
    let now = new Date().getHours();
    if (now >= 6 && now < 9) {
        return "早上";
    } else if (now >= 9 && now < 12) {
        return "上午";
    } else if (now >= 12 && now < 18) {
        return "下午";
    } else {
        return "晚上";
    }
}
