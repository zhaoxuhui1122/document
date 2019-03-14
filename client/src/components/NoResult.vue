<template>
    <div class="no-result">
        <img src="../../static/img/no_result.png" alt="">
        <div>
            <h1>页面暂无内容</h1>
            <p>抱歉，页面暂无内容，请看看其他页面</p>
        </div>
    </div>
</template>

<script>
    export default {
        name : 'NoResult'
    };
</script>

<style scoped lang="less">
    .no-result {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 10vh;
        img{
            width:220px;
            height: 220px;
            margin-right: 20px;
        }
        h1{
            font-size: 24px;
            margin-bottom: 20px;
        }
        p{
            font-size: 16px;
        }
    }
    @media only screen and (max-width: 1200px ){
        .no-result {
            img{
                width:80px;
                height: 80px;
                margin-right: 10px;
            }
            h1{
                font-size: 22px;
                margin-bottom: 10px;
            }
            p{
                font-size: 13px;
            }
        }
    }
</style>
