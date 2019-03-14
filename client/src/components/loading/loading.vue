<template>
    <div class="c-loading">
        <span><i></i></span><span><i></i></span><span><i></i></span><span><i></i></span>
    </div>
</template>

<script>
    export default {
        name : 'loading',
    };
</script>
<style scoped lang="less">
    .c-loading {
        display: inline-block;
        width: 40px;
        height: 40px;
        overflow: hidden;
        animation: rotate 1s linear forwards infinite;
        position:fixed;
        top: 30%;
        left: 50%;
        margin-left: -20px;
        span {
            float: left;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
            }
            &:nth-of-type(1) {
                i {
                    background: #1786ff;
                }
            }
            &:nth-of-type(2) {
                i {
                    background: #52a3fb;
                }
            }
            &:nth-of-type(3) {
                i {
                    background: #93c3f8;
                }
            }
            &:nth-of-type(4) {
                i {
                    background: #54a4fb;
                }
            }

        }
    }

    @keyframes rotate {
        0% {

        }
        50% {
            opacity: 0.8;
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
