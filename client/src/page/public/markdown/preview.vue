<template>
    <Card>
        <div slot="title">
            <Breadcrumb>
                <BreadcrumbItem to="/document/public">公共文档</BreadcrumbItem>
                <BreadcrumbItem>
                    <router-link v-show="!fromRubbish" :to="{path:`/document/directory/${directoryId}`,query:{dirName}}"> {{ dirName }}</router-link>
                    <router-link v-show="fromRubbish"  to="/document/rubbish">回收站</router-link>
                </BreadcrumbItem>
                <BreadcrumbItem>{{ title }}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div slot="extra" v-show="!fromRubbish">
            <router-link :to="`/markdown/update/${$route.params.id}`">
                <Button type="primary">编辑</Button>
            </router-link>
        </div>
        <div :class="className" v-html="previewHtml" ref="preview">

        </div>
    </Card>
</template>

<script>
    import hljs from 'highlight.js';
    import marked from 'marked';
    import { getLocationParams } from '../../../utils/utils';

    hljs.initHighlightingOnLoad();

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });
    export default {
        name: 'preview',
        computed: {
            className() {
                return `markdown-preview  ${this.theme}`;
            }
        },
        data() {
            return {
                theme: '',
                previewHtml: '',
                markdownValue: '',
                title: '',
                updateAt: '',
                showUpdateBtn: false,
                dirName: '',
                directoryId: '',
                fromRubbish:false
            };
        },
        mounted() {
            this.queryDetail();
            const { dirName, directoryId ,fromRubbish} = getLocationParams();
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
                    if (content) {
                        const { markdownValue, themeName } = JSON.parse(content);
                        this.markdownValue = markdownValue;
                        this.theme = themeName;
                    }
                }
            },
            addCopyListener() { // 监听复制操作
                setTimeout(() => {
                    const btns = document.querySelectorAll('.code-block .copy-code');
                    this.btns = btns;
                    for (let i = 0, len = btns.length; i < len; i++) {
                        btns[i].onclick = () => {
                            const code = btns[i].parentNode.querySelectorAll('pre')[0].innerText;
                            const aux = document.createElement('input');
                            aux.setAttribute('value', code);
                            document.body.appendChild(aux);
                            aux.select();
                            document.execCommand('copy');
                            document.body.removeChild(aux);
                            this.$Message.success('已复制到剪切板');
                        };
                    }

                }, 600);
            },

        },
        watch: {
            markdownValue() {
                this.previewHtml = marked(this.markdownValue, {
                    sanitize: false
                }).replace(/href="/ig, 'target="_blank" href="')
                    .replace(/\<pre\>/g, '<div class="code-block"><span class="copy-code">复制代码</span><pre>')
                    .replace(/\<\/pre\>/g, '</pre></div>');
                this.addCopyListener();
            }
        }
    };
</script>

<style lang="less">
    @import "../../../assets/css/theme";
    @import "../../../assets/css/common";
    @import "../../../components/markdown/css/light";
    @import "../../../components/markdown/css/dark";
    @import "../../../components/markdown/css/oneDark";
    @import "../../../components/markdown/css/gitHub";
    @import "../../../components/markdown/css/common";
    @import "../../../components/markdown/css/index";

    .preview-markdown {
        display: flex;
        flex-direction: column;
        .main {
            padding: 30px 0;
            flex: 1;
            overflow: auto;

            &::-webkit-scrollbar {
                display: none;
            }

            .layout {
                min-height: 90vh;
                background: @white;
                margin: 0 auto;
                border-radius: 10px;
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

            .markdown-preview {
                width: 100% !important;
                max-width: initial;
            }
        }
    }

    @media only screen and (min-width: 1600px) {
        .markdown-preview {
            max-width: initial;
            margin: 0 auto !important;
        }
    }
</style>
