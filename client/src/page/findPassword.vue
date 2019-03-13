<template>
    <div class="login-container">
        <h2 class="project-name">密码找回</h2>
        <div class="login-form">
            <ul>
                <li class="title">忘记密码</li>
                <li class="input">
                    <input :class="{error:nameError}" v-model="name" @blur="validateName" type="text" name="name" id="name" placeholder="请输入用户名" autocomplete="off">
                </li>
                <li :class="`error ${nameError?'active':''}`">请输入用户名</li>
                <li class="input">
                    <input :class="{error:passwordError}" v-model="password" @blur="validatePassword" type="password" name="password" id="password" placeholder="请输入新的密码" autocomplete="off">
                </li>
                <li :class="`error ${passwordError?'active':''}`">请输入新的密码</li>
                <li class="forget-password">
                    <router-link to="/login">返回登录</router-link>
                </li>
                <li class="submit">
                    <button type="button" @click="handleSubmit">找回密码</button>
                </li>
                <li style="text-align: center" :class="`error ${requestError?'active':''}`">用户名或密码错误</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                name: '',
                password: '',
                nameError: false,
                passwordError: false,
                requestError: false
            };
        },
        methods: {
            validateName() {
                const { name } = this;
                if (name) {
                    this.nameError = false;
                } else {
                    this.nameError = true;
                }
            },
            validatePassword() {
                const { password } = this;
                if (password) {
                    this.passwordError = false;
                } else {
                    this.passwordError = true;
                }
            },
            async handleSubmit() {
                this.validateName();
                this.validatePassword();
                const { name, password } = this;
                if (name && password) {
                    const res = await this.$post(this.$API.findPassWord, {
                        name,
                        password
                    },{tost:true});
                    if (res.resultCode) {
                        this.$router.push({
                            path: '/login'
                        });
                    }
                }
            }
        }
    };
</script>

<style scoped lang="less">
    @import "../assets/css/theme";
    .login-container {
        height: 100vh;
        padding-top: 10%;
        background: url("https://cdn.bdstatic.com/login/bg-1920x1080.png@q_90") no-repeat;
        background-size: cover;
        position: relative;

        .logo {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            height: 60px;
            padding: 0 20px;

            .icon {
                width: 30px;
                height: 30px;
                margin-right: 6px;
                margin-top: 4px;
                background: url("/static/img/logo.png") no-repeat center;
                background-size: contain;
            }

            h1 {
                font-size: 24px;
                color: @white;
            }
        }

        .project-name {
            color: @white;
            text-align: center;
            font-size: 24px;
            line-height: 40px;
            margin-bottom: 30px;
        }

        .login-form {
            width: 400px;
            background: @white;
            margin: 0 auto;
            border: 1px solid #ededed;
            //box-shadow: 3px 4px 5px #ededed,-2px -2px 3px #ededed;
            border-radius: 4px;
            padding-bottom: 30px;

            li {
                padding: 0 20px;

                &.title {
                    font-size: 16px;
                    line-height: 40px;
                    margin-bottom: 40px;
                    background: #fafafa;
                    color: #1890ff;
                    box-shadow: 0 2px 2px #ededed;
                }

                &.input {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    label {
                        font-size: 13px;
                        color: #666;
                        display: block;
                        width: 60px;
                    }

                    input {
                        display: block;
                        flex: 1;
                        border: 1px solid #ccc;
                        font-size: 14px;
                        padding: 4px 8px;
                        height: 40px;
                        color: #333;
                        background: @white;
                        border-radius: 4px;
                        writing-mode: horizontal-tb;
                        text-rendering: auto;
                        transition: box-shadow 2s;

                        &:focus {
                            border-color: #1890ff;
                        }

                        &.error {
                            border-color: #f5222d;
                        }
                    }
                }

                &.error {
                    height: 24px;
                    line-height: 24px;
                    font-size: 12px;
                    color: #f5222d;
                    opacity: 0;
                    transition: all .3s;

                    &.active {
                        opacity: 1;
                    }
                }

                &.submit {
                    padding-top: 20px;

                    button {
                        display: block;
                        text-align: center;
                        width: 100%;
                        height: 40px;
                        background: #40a9ff;
                        border: 0;
                        outline: medium;
                        cursor: pointer;
                        padding: 0 12px;
                        border-radius: 4px;
                        font-size: 16px;
                        color: @white;
                        line-height: 40px;
                        transition: all 0.6s;
                        letter-spacing: 10px;

                        &:active {
                            background: #1890ff;
                        }
                    }
                }

                &.forget-password {
                    font-size: 12px;
                    text-align: right;
                }
            }
        }
    }

    @media only screen and (min-width: 1600px) {
        .login-container {
            .login-form {
                width: 480px;
            }
        }
    }
</style>
