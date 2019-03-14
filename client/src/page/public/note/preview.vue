<template>
    <Card>
        <div slot="title">
            <Breadcrumb>
                <BreadcrumbItem to="/document/public">公共文档</BreadcrumbItem>
                <BreadcrumbItem v-show="!fromRubbish" :to="{path:`/document/directory/${directoryId}`,query:{directoryId,dirName}}">{{ dirName }}</BreadcrumbItem>
                <BreadcrumbItem v-show="fromRubbish"  to="/document/rubbish">回收站</BreadcrumbItem>
                <BreadcrumbItem>{{ title }}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div slot="extra" v-show="!fromRubbish">
            <router-link :to="`/note/update/${$route.params.id}`">
                <Button type="primary">编辑</Button>
            </router-link>
        </div>
        <div class="preview" v-html="previewHtml"></div>
    </Card>
</template>

<script>
    import { getLocationParams } from '../../../utils/utils';

    export default {
        name: 'preview',
        data() {
            return {
                title: '',
                previewHtml: '',
                updateAt: '',
                showUpdateBtn: false,
                directoryId: '',
                dirName: '',
                fromRubbish:false
            };
        },
        mounted() {
            this.queryDetail();
            const { dirName, directoryId,fromRubbish } = getLocationParams();
            this.dirName = dirName;
            this.directoryId = directoryId;
            if(fromRubbish){
                this.fromRubbish = true ;
            }
        },
        methods: {
            async queryDetail() {
                const { params: { id } } = this.$route;
                const res = await this.$post(this.$API.queryDocumentDetail, {
                    id
                });
                const { resultCode, data } = res;
                if (resultCode) {
                    const { content, title, updateAt, ownerId } = data;
                    const { state: { userInfo: { id: userId } } } = this.$store;
                    if (ownerId === userId) {
                        this.showUpdateBtn = true;
                    }
                    this.title = title;
                    this.updateAt = updateAt;
                    this.previewHtml = content;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../../assets/css/theme";
    @import "../../../assets/css/common";

    .note-preview {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .main {
        background: @background;
        overflow: auto;
        flex: 1;

        &::-webkit-scrollbar {
            display: none;
        }

        .content {
            padding: 30px 0;

            .layout {
                width: 1200px;
                min-height: 90vh;
                background: @white;
                margin: 0 auto;
                border-radius: 8px;
                padding: 20px;

                .title {
                    font-size: 24px;
                    line-height: 50px;
                    text-align: justify;
                    color: @title;
                    border-bottom: 1px solid @border;
                }

                .time {
                    font-size: 13px;
                    color: @tip;
                    line-height: 40px;
                }
            }
        }
    }

</style>
<style scoped>
    .preview >>> *{
        font-size: 16px;
        color: #000;
    }
    .preview >>>pre{
        margin: 20px 0;
        padding: 20px;
        border-radius: 8px;
        background: #f8f8f8;
        line-height: 1.6 !important;
        font-size: 14px;
        font-family: Consolas !important;
    }
    .preview >>>table{
        width: 100%;
        border: 1px solid #ddd;
        border-collapse: collapse;
        border-spacing: 0;
    }
    .preview >>>table td{
        word-break: break-all;
        white-space: normal;
        border: 1px solid #ddd;
        line-height: 20px;
        padding: 5px 10px;
        font-size: 16px;
        font-family: Arial, Helvetica, Tahoma, Verdana, Sans-Serif;
        overflow: hidden;
    }
    .preview >>>ol,.preview >>>ul{
        padding: 10px 0;
        padding-left: 30px;
        width: 95%;
    }
    .preview >>>ol p,.preview >>>ul p {
        display: block;
    }
</style>
