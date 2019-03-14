<template>
    <div>
        <Card>
            <p slot="title">{{type===1?'产品文档' :'UI设计稿'}}</p>
            <i-Form>
                <FormItem label="项目名称" :label-width="80">
                    <Input v-model="name"/>
                </FormItem>
                <FormItem label="项目说明" :label-width="80">
                    <Input type="textarea" :rows="5" v-model="introduce"/>
                </FormItem>
                <FormItem label="文件压缩包" :label-width="80">
                    <div style="padding: 20px 0" class="upload-box" v-show="showUploadBox">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击上传文件压缩包，目前只支持zip格式</p>
                        <input type="file" @change="handleUpload($event)" accept="application/zip">
                    </div>
                    <div v-show="!showUploadBox">
                        <span>{{ zipName }}</span>
                        <Button type="primary" size="small" @click="chooseZipAgain">重新选择文件</Button>
                    </div>
                </FormItem>
                <FormItem label="默认首页" :label-width="80">
                    <Select vertical v-model="indexUrl">
                        <Option v-for="(item,index) in htmlList" :key="index" :value="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="80">
                    <Button type="primary" @click="handleSubmit">提交</Button>
                </FormItem>
            </i-Form>
        </Card>
    </div>
</template>

<script>
    export default {
        name : 'product-form',
        data() {
            return {
                title : '',
                name : '',// 项目名称
                introduce : '',// 简介
                zipUrl : '',// 项目压缩包地址
                indexUrl : '',// 页面入口文件
                zipName : '',
                htmlList : [],
                tmpDirectory : '',// 上传的文件缓存地址
                showUploadBox : true,
                loading : false,
                productId : ''
            };
        },
        computed : {
            isUpdate() {
                const {name} = this.$route;
                if (name === 'product-update') {
                    return true;
                } else {
                    return false;
                }
            },
            type() {
                const {query : {type = 1}} = this.$route;
                return type;
            }
        },
        mounted() {
            if (this.isUpdate) {
                this.queryDetail();

            }
        },
        methods : {
            async queryDetail() {
                const {params : {id}} = this.$route;
                const res = await this.$post(this.$API.queryProductDetail, {
                    id
                }, {tost : false});
                if (res.resultCode) {
                    const {name, indexUrl, introduce, zipUrl, htmlList = []} = res.data;
                    this.name = name;
                    this.introduce = introduce;
                    this.zipName = zipUrl;
                    this.zipUrl = zipUrl;
                    this.indexUrl = indexUrl;
                    this.htmlList = htmlList;
                    this.showUploadBox = false;
                }
            },
            async handleSubmit() {
                const {name, introduce, zipName, zipUrl, indexUrl, tmpDirectory, htmlList, isUpdate,type} = this;
                if (! name) {
                    this.$Message.error('请输入项目名称');
                    return;
                } else if(name.length<2||name.length>20){
                    this.$Message.error('项目名称长度为2-20');
                    return;
                }else if (! zipName) {
                    this.$Message.error('请选择文件压缩包');
                    return;
                } else if (! indexUrl) {
                    this.$Message.error('请选择项目默认首页路径');
                    return;
                }
                const {state : {userInfo : {id : userId}}} = this.$store;
                const {params : {id}} = this.$route;
                const res = await this.$post(isUpdate ? this.$API.updateProduct: this.$API.createProduct, isUpdate ? {
                    id,
                    name,
                    introduce,
                    zipUrl,
                    indexUrl,
                    tmpDirectory,
                    htmlList,
                }: {
                    name,
                    type,
                    introduce,
                    zipUrl,
                    userId : isUpdate ? null: userId,
                    indexUrl,
                    tmpDirectory,
                    htmlList
                }, {tost : true});
                if (res.resultCode) {
                    this.$router.go(- 1);
                }
            },
            async handleUpload(e) {
                const file = e.target.files[0];
                const formData = new FormData();
                const {name, type} = file;
                if (type !== 'application/zip') {
                    this.$Message.error('必须为zip格式');
                    e.target.value = '';
                    return;
                }
                formData.append('file', file);
                formData.append('name', name);
                this.$Loading.init();
                const res = await this.$post(this.$API.uploadZip, formData, {
                    config : {
                        headers : {'Content-Type' : 'multipart/form-data'}
                    },
                    tost : true
                });
                this.$Loading.done();
                e.target.value = '';
                if (res.resultCode) {
                    const {data : {zipUrl, htmlList, directory}} = res;
                    this.zipName = name;
                    this.zipUrl = zipUrl;
                    this.htmlList = htmlList;
                    this.tmpDirectory = directory;
                    this.showUploadBox = false;
                }
            },
            chooseZipAgain() { // 重新选择zip压缩包
                this.zipUrl = '';
                this.indexUrl = '';
                this.htmlList = [];
                this.zipName = '';
                this.showUploadBox = true;
            }
        }
    };
</script>

<style scoped lang="less">
    @import "../../assets/css/theme";

    .upload-box {
        border: 1px dashed #dcdee2;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 4px;
        position: relative;
        transition: all .3s;
        input {
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: pointer;
            opacity: 0;
        }
        &:hover {
            border-color: @primary;
        }

    }
</style>
