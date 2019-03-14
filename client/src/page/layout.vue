<template>
    <div class="container">
        <div :class="`header  ${theme}`">
            <div class="layout">
                <h1 @click="$router.push({path:'/'})">Document</h1>
                <div class="menus">
                    <Menu mode="horizontal" :theme="theme" :active-name="$route.name">
                        <MenuItem name="product-list" to="/document/product">
                            <Icon type="ios-book-outline"/>
                            产品文档
                        </MenuItem>
                        <MenuItem name="ui-list" to="/document/ui">
                            <Icon type="ios-aperture-outline"/>
                            UI设计
                        </MenuItem>
                        <MenuItem name="public-list" to="/document/public">
                            <Icon type="ios-list-box-outline"/>
                            公共文档
                        </MenuItem>
                        <MenuItem name="user-list" to="/user/list" v-show="userType==='ADMIN'">
                            <Icon type="ios-people-outline"/>
                            用户管理
                        </MenuItem>
                    </Menu>
                </div>
                <div class="user">
                    <Avatar icon="ios-person" style="background: #7265e6;"/>
                    <Dropdown @on-click="handleDropdownChange">
                    <span class="user-name">
                        {{ $store.state.userInfo.name }}
                        <Icon type="ios-arrow-down"></Icon>
                    </span>
                        <DropdownMenu slot="list">
                            <DropdownItem name="1">修改个人信息</DropdownItem>
                            <DropdownItem name="2">退出</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="layout">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    import {THEME} from '../constant'

    export default {
        name : 'index',
        data() {
            return {
                userType : '',
                theme : THEME
            };
        },
        mounted() {
            const {state : {userInfo : {type, name}}} = this.$store;
            this.userType = type;
        },
        methods : {
            handleDropdownChange(res) {
                if (res === '1') {
                    const {state : {userInfo : {id}}} = this.$store;
                    this.$router.push({
                        path : `/user/update/${ id }`
                    });
                } else {
                    this.$Modal.confirm({
                        title : '提示',
                        content : '确定退出当前登录账号？',
                        onOk : () => {
                            this.$store.commit('setLogout');
                            this.$router.push({
                                path : '/login'
                            });
                        }
                    });
                }
            }
        }
    };
</script>

<style scoped lang="less">
    @import "../assets/css/theme";

    .container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;

        .header {
            height: 60px;
            width: 100%;
            .layout {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            &.primary {
                background: #2d8cf0;
            }

            &.dark {
                background: #515a6e;

                .ivu-menu-item-selected {
                    background: #434e64;
                }
            }

          h1{
              color: #fff;
              padding-left: 4px;
              font-size: 20px;
              font-weight: bold;
              line-height: 60px;
              cursor: pointer;
          }

            .user {
                padding: 0 40px;

                .user-name {
                    color: @white;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                    padding: 0 10px;
                }
            }
        }

        .content {
            flex: 1;
            width: 100%;
            overflow: auto;
            .layout {
                margin: 30px auto;
                // padding: 30px;
                // background: @white;
                min-height: 85vh;
                border-radius: 4px;
            }
        }
        .mini-header{
            display: none;

            height: 60px;
            &.primary {
                background: #2d8cf0;
            }
            &.dark {
                background: #515a6e;
                .ivu-menu-item-selected {
                    background: #434e64;
                }
            }
            position: relative;

        }
    }

    .layout {
        margin: 0 auto;
    }

    @media only screen and(min-width: 1201px)  and (max-width: 1440px) {
        .layout {
            width: 1200px;
        }
    }

    @media only screen and(min-width: 1441px)  and (max-width: 1920px) {
        .layout {
            width: 1200px;
        }
    }

    @media only screen and(min-width: 1921px) {
        .layout {
            width: 80%;
        }
    }

    @media only screen and (max-width: 1200px ) {

        .container{
            .layout{
                width: 100%;
            }
            .mini-header{
                display: block;
            }
            .content{
                .ivu-card {
                    height: 100% !important;
                }
            }
        }

    }


</style>
