<template>
    <ul class="contextmenu" ref="contextmenu" :style="{left:`${left}px`,top:`${top}px`}" @mouseleave="close">
        <li
            v-for="(item,index) in data"
            :key="index"
            @click.stop="handleClick(item)"
            @mouseover="current=index"
            @mouseout="current=null"
        >
            <span> {{ item.name }}</span>
        </li>
    </ul>
</template>

<script>
    export default {
        name : 'contextmenu',
        props : {
            data : {
                type : Array,
                default() {
                    return [];
                }
            },
            onClick : {
                type : Function,
                default : () => {

                }
            },
            left : {
                type : Number,
                required : true
            },
            top : {
                type : Number,
                required : true
            }
        },
        data() {
            return {
                current : null
            };
        },
        mounted() {
            document.addEventListener('keydown', e => {
                this.$refs.contextmenu.remove();
            });
            document.addEventListener('mousedown', e => {
                const {current} = this;
                if (current !== null) {
                    return;
                }
                const el = this.$refs.contextmenu;
                if (e.which === 1 && el) {
                    el.remove();
                }
            });
        },
        methods : {
            handleClick(item) {
                this.onClick(item);
                this.$refs.contextmenu.remove();
            },
            close() {
                this.$refs.contextmenu.remove();
            }
        }
    };
</script>

<style scoped lang="less">
    @import "../../assets/css/theme";
    .contextmenu {
        list-style: none;
        margin: 0;
        padding:6px 0;
        box-sizing: border-box;
        border: 1px solid @border;
        background: #fff;
        border-radius:4px;
        position: absolute;
        z-index: 9999999;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.1);
        font-family: "Monospaced Number", "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        * {
            list-style: none;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        display: inline-block;
        li {
            line-height: 30px;
            padding: 0 20px;
            padding-left: 12px;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            .iconfont{
                font-size: 14px;
                display: inline-block;
                height: 30px;
                width: 24px;
                line-height: 30px;
            }
            &:last-child {
                border-bottom: 0;
            }
            display: block;
            min-width: 120px;
            color: @content;
            &:hover {
                background: @background;
            }
            &.disabled {
                cursor: not-allowed;
                color: @disabled;
                &:hover {
                    background: transparent;
                }
            }
        }
    }
</style>
