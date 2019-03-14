<template>
    <div>
        <Card>
            <p slot="title">{{ title }}</p>
            <div slot="extra">
                <Button type="error" @click="handleRemove" v-show="showHandleBtn">删除</Button>
                <router-link :to="`/document/product/update/${$route.params.id}`">
                    <Button type="primary">修改</Button>
                </router-link>
            </div>
            <div class="content">
                <ul>
                    <li>
                        <span>更新时间：</span>
                        <p>{{ $moment(updateAt).format('YYYY-MM-DD HH:mm') }}</p>
                    </li>
                    <li>
                        <span>创建人：</span>
                        <p>{{ ownerName }}
                            <Tag color="blue" style="margin: 0 10px;">{{ ownerType }}</Tag>
                            {{ ownerEmail }}
                        </p>
                    </li>
                    <li>
                        <span>项目简介：</span>
                        <p>{{ introduce }}</p>
                    </li>
                    <li>
                        <span>压缩包下载</span>
                        <a target="_blank" :href="baseUrl+zipUrl" :download="title">{{ zipUrl }}</a>
                    </li>
                    <li>
                        <span>详情地址</span>
                        <a target="_blank" :href="baseUrl+indexUrl">{{indexUrl }}</a>
                    </li>
                </ul>
            </div>
        </Card>
    </div>
</template>
<script>
    import {BASE_URL,USER_TYPES} from '../../constant';

    export default {
        data() {
            return {
                title : '详情',
                indexUrl : '',// 详情地址
                introduce : '',// 简介
                updateAt : '',// 更新时间
                zipUrl : '',// 压缩包地址
                ownerName : '',// 作者姓名
                ownerType : '',
                ownerEmail : '',
                showHandleBtn : false,
                baseUrl:BASE_URL
            };
        },
        mounted() {
            this.queryDetail();
        },
        methods : {
            async queryDetail() {
                const {params : {id}} = this.$route;
                const res = await this.$post(this.$API.queryProductDetail, {
                    id
                });
                if (res.resultCode) {
                    const {name, indexUrl, introduce, updateAt, zipUrl, userId} = res.data;
                    const {state : {userInfo : {id : currentUserId,type}}} = this.$store;
                    if (userId === currentUserId||type==='ADMIN') {
                        this.showHandleBtn = true;
                    } else {
                        this.showHandleBtn = false;
                    }
                    this.title = name;
                    this.indexUrl = indexUrl;
                    this.introduce = introduce;
                    this.updateAt = updateAt;
                    this.zipUrl = zipUrl;
                    const owner = await this.$post(this.$API.userDetail, {
                        id : userId
                    });
                    if (owner.resultCode) {
                        const {data : {name:userName, type, email}} = owner;
                        this.ownerName = userName;
                        this.ownerType = USER_TYPES[type];
                        this.ownerEmail = email;
                    }
                }
            },
            handleRemove() {
                const {params : {id}} = this.$route;
                this.$Modal.confirm({
                    title:'确定删除？',
                    onOk:async ()=>{
                        const res = await this.$post(this.$API.removeProduct, {id}, {tost:true});
                        if(res.resultCode){
                            this.$router.go(-1);
                        }
                    }
                });

            }
        }
    };
</script>
<style scoped lang="less">
    @import "../../assets/css/theme";

    .content {
        display: flex;
        li {
            display: flex;
            h2 {
                color: @title;
                line-height: 40px;
                font-weight: bold;
                color: @primary;
            }
            margin-bottom: 20px;
            span {
                display: block;
                width: 100px;
                font-weight: bold;
                color: @title;
                white-space: nowrap;
            }
            p {
                display: block;
                flex: 1;
                font-size: 14px;
                padding-right: 40px;
            }
        }
    }
</style>
