<template>
    <div class="error">
        <img src="../../static/img/404.png" alt="">
        <div>
            <h1>抱歉，你访问的页面不存在</h1>
            <p>您要找的页面没有找到，请返回
                <router-link to="/">首页</router-link>
                继续浏览
            </p>
        </div>
    </div>
</template>

<script>

    export default {
        name : 'error',
        data() {
            return {};
        },
    };
</script>

<style scoped lang="less">
    .error {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 20vh;
        img {
            display: block;
            width: 260px;
            margin-right: 20px;
        }

        h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        p{
            font-size: 16px;
        }
    }
</style>
