<template>
    <div ref="ueditorContainer" @mouseleave="handleSave">
        <script :id="id" type="text/plain"></script>
    </div>
</template>
<script>
    import {AUTO_SAVE_INTERVAL} from '../../constant';

    export default {
        props : {
            id : { // editorId，为区分页面中不同的编辑器实例
                type : String,
                required : true
            },
            height : { // 初始化高度
                type : Number,
                default : 500
            },
            width : {
                type : Number,
                default : 800
            },
            config : { // 配置项
                type : Object,
                default() {
                    return {};
                }
            },
            autoSave : { // 自动保存
                type : Boolean,
                default : true
            },
            interval : {
                type : Number,
                default : 10000
            },
            documentId : {
                type : String,
                default : ''
            },
            menuIndex : {}
        },
        data() {
            return {
                editor : null,
                timerId : null,
                content : '',
                detail : {},
                isOnsave : false
            };
        },
        mounted() {
            setTimeout(() => {
                this.initEditor();
                if (this.documentId) {
                    this.queryDetail();
                }
            }, 200);

        },
        methods : {
            initEditor() { // init editor
                const that = this;
                // 初始化editor
                const height = this.$refs.ueditorContainer.parentNode.offsetHeight;
                this.editor = UE.getEditor(this.id, Object.assign(this.config, {
                    initialFrameHeight : height - 80,
                    initialFrameWidth : '100%',
                    handleSave : () => {
                        that.handleSave(false);
                    }
                }));
                this.editor.ready(ueditor => {
                    if (! ueditor) {
                        UE.delEditor(that.id);
                        that.initEditor();
                    }
                });
                this.timerId = setInterval(() => {
                    this.handleSave();
                }, AUTO_SAVE_INTERVAL);
            },
            async handleSave(isAuto = true) { // 存储
                const {documentId : id, isOnsave} = this;
                const {state : {userInfo : {id : ownerId}}} = this.$store;
                const html = this.editor.getContent();
                this.$emit('on-save', true);
                if (isOnsave) {
                    return;
                }
                this.isOnsave = true;
                const res = await this.$post('/document/update', {
                    id,
                    ownerId,
                    content : html
                });
                if (res.resultCode && ! isAuto) {
                    this.$Message.success('保存成功');
                }
                setTimeout(() => {
                    this.$emit('on-save', false);
                }, 300);
                setTimeout(() => {
                    this.isOnsave = false;
                }, 1000);
            },
            async queryDetail() {
                const id = this.documentId;
                const res = await this.$post('/document/detail', {
                    id
                });
                const {resultCode, data = {}} = res;
                if (resultCode) {
                    this.detail = data;
                }
            }
        },
        destroyed() { // 组件销毁时小会editor
            this.editor.destroy();
            clearInterval(this.timerId);
        },
        watch : {
            documentId() {
                const id = this.documentId;
                if (id) {
                    this.queryDetail();
                }
            },
            detail() {
                if (this.editor) {
                    const {detail : {content = ''}} = this;
                    setTimeout(() => {
                        if (content) {
                            this.editor.setContent(content);
                        } else {
                            this.editor.setContent('');
                        }
                    }, 300);
                }
            },
            height() {
                if (this.editor) {
                    this.editor.setHeight(this.height - 80);
                }
            }
        }
    };
</script>
<style>
</style>
