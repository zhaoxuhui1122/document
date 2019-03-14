<template>
    <Card title="新增用户">
        <i-Form ref="userForm" :model="formValue" :rules="ruleValidate" :label-width="80">
            <FormItem label="用户名" prop="name">
                <Input type="text" v-model="formValue.name"/>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input type="password" v-model="formValue.password" placeholder="默认密码123456"/>
            </FormItem>
            <FormItem label="邮箱号" prop="email">
                <Input type="text" v-model="formValue.email"/>
            </FormItem>
            <FormItem label="用户类型" prop="type" v-show="!isUpdate">
                <Select v-model="formValue.type">
                    <Option :value="key" :key="index" v-for="(key,index) in Object.keys(userType)">{{ userType[key] }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem style="padding-top: 20px;">
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button @click="handleReset" style="margin-left: 8px">重置</Button>
            </FormItem>
        </i-Form>
    </Card>
</template>
<script>
    import {USER_TYPES} from '../../../constant';

    export default {
        data() {
            return {
                formValue : {
                    name : '',
                    password : '',
                    email : '',
                    type : ''
                },
                ruleValidate : {
                    name : [{
                        required : true,
                        trigger : 'blur'
                    }, {type : 'string', max : 20, min : 2}
                    ],
                    password : [],
                    email : [{
                        required : true,
                        trigger : 'blur'
                    }, {
                        type : 'email',
                        trigger : 'blur'
                    }],
                    type : [{
                        required : true,
                        trigger : 'change'
                    }]
                },
                userType : USER_TYPES
            };
        },
        computed : {
            isUpdate() {
                const {params : {id}} = this.$route;
                if (id) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        mounted() {
            if (this.isUpdate) {
                this.init();
            }
        },
        methods : {
            async init() {
                const {params : {id}} = this.$route;
                const res = await this.$post(this.$API.userDetail, {id});
                if (res.resultCode) {
                    const {formValue} = this;
                    const {data = {}} = res;
                    this.formValue = {
                        ...formValue,
                        ...data,
                        type : data.type.toString()
                    };
                }
            },
            async handleSubmit() {
                this.$refs.userForm.validate(async valid => {
                    if (! valid) {
                        return;
                    }
                    const {isUpdate, formValue} = this;
                    const {params : {id}} = this.$route;
                    if (isUpdate) {
                        const res = await this.$post(this.$API.userUpdate, {
                            id,
                            ...formValue,
                            password : formValue.password ? formValue.password: '123456'
                        }, {tost : true});
                        const {resultCode} = res;
                        if (resultCode) {
                            const {state : {userInfo = {}}} = this.$store;
                            if (id === userInfo.id) {// 说明是修改自己的信息
                                this.$store.commit('setUserInfo', {
                                    ...userInfo,
                                    name : formValue.name
                                });
                            }
                            this.$router.go(- 1);
                        }
                    } else {
                        const res = await this.$post(this.$API.userCreate, {
                            ...formValue,
                            password : formValue.password ? formValue.password: '123456'
                        }, {tost : true});
                        const {resultCode} = res;
                        if (resultCode) {
                            this.$router.go(- 1);
                        }
                    }
                });
            },
            handleReset() {
                this.$refs.userForm.resetFields();
            }
        }
    };
</script>
