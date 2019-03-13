import hljs from 'highlight.js';
import marked from 'marked';
import {saveFile} from '../../utils/utils';
import {AUTO_SAVE_INTERVAL} from '../../constant';

hljs.initHighlightingOnLoad();
const renderer = new marked.Renderer();

marked.setOptions({
    renderer,
    gfm : true,
    tables : true,
    breaks : false,
    pedantic : false,
    sanitize : false,
    smartLists : true,
    highlight : function (code) {
        return hljs.highlightAuto(code).value;
    }
});

export default {
    name : 'markdown',
    props : {
        title : { // 标题
            type : String,
            default : ''
        },
        titleStyle : { // 标题样式
            type : Object,
            default() {
                return {};
            }
        },
        theme : { // 默认主题
            type : String,
            default : 'Light'
        },
        width : { // 宽度
            type : [Number, String],
            default : 'auto'
        },
        height : { // 高度
            type : Number,
            default : 600
        }, // 宽度
        toolbars : { // 工具栏
            type : Object,
            default() {
                return {};
            }
        },
        documentId : {
            type : String,
            default : ''
        }
    },
    data() {
        return {
            value : '', // 输入框内容
            timeoutId : null,
            hljsInit : null,
            indexLenth : 1,
            previewMarkdown : '',
            preview : 1, // 是否是预览状态
            isFullscreen : false,
            scrollHeight : null,
            scroll : 'markdown', // 哪个半栏在滑动
            allTools : { // 显示隐藏的工具栏
                strong : true,
                italic : true,
                overline : true,
                h1 : true,
                h2 : true,
                h3 : true,
                h4 : false,
                h5 : false,
                h6 : false,
                hr : true,
                quote : true,
                ul : true,
                ol : true,
                code : true,
                link : true,
                image : true,
                table : true,
                checked : true,
                notChecked : true,
                shift : true,
                fullscreen : true,
                theme : true,
                exportmd : true,
                importmd : true
            },
            themeName : 'Light', // 主题名称
            lastInsert : '',
            timerId : null, // 定时器id
            insertType : 0, // 插入图片方式
            showInsertImgModal : false,
            showInsertFileModal:false,
            imgUrl : '',
            documentTitle : '',
            themeSlideDown : false,
            exportSlideDown : false,
            imgs : [],
            isOnsave : false,
            scrolling:true,// 同步滚动
        };
    },
    computed : {
        editorHeight() {
            if (this.isFullscreen) {
                return window.innerHeight;
            } else {
                return this.height;
            }
        },
        tools() {
            const {allTools, toolbars} = this;
            return Object.assign(allTools, toolbars);
        }
    },
    mounted() {
        setTimeout(() => {
            const textarea = this.$refs.textarea;
            textarea.focus();
            textarea.addEventListener('keydown', e => {
                if (e.keyCode === 83) {
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        this.handleSave();
                    }
                }
            });
            this.autoSave();
        }, 20);
    },
    methods : {
        markdownScroll() {
            const {scrolling} = this ;
            if(!scrolling){
                return ;
            }
            if (this.scroll === 'markdown') {
                const markdownContent = this.$refs.markdownContent;
                const preview = this.$refs.preview;
                const markdownScrollHeight = markdownContent.scrollHeight;
                const markdownScrollTop = markdownContent.scrollTop;
                const previewScrollHeight = preview.scrollHeight;
                preview.scrollTop = parseInt(markdownScrollTop / markdownScrollHeight * previewScrollHeight,0);
            }
        },
        previewScroll() {
            const {scrolling} = this ;
            if(!scrolling){
                return ;
            }
            if (this.scroll === 'preview') {
                const markdownContent = this.$refs.markdownContent;
                const preview = this.$refs.preview;
                const markdownScrollHeight = markdownContent.scrollHeight;
                const previewScrollHeight = preview.scrollHeight;
                const previewScrollTop = preview.scrollTop;
                markdownContent.scrollTop = parseInt(previewScrollTop / previewScrollHeight * markdownScrollHeight,0);
            }
        },
        mousescrollSide(side) { // 设置究竟是哪个半边在主动滑动
            this.scroll = side;
        },
        insertContent(str) { // 插入文本
            const {preview} = this;
            if (preview === 2) {
                return;
            }
            this.lastInsert = str;
            const point = this.getCursortPosition();
            const lastChart = this.value.substring(point - 1, point);
            const lastFourCharts = this.value.substring(point - 4, point);
            if (lastChart !== '\n' && this.value !== '' && lastFourCharts !== '    ') {
                str = '\n' + str;
                this.insertAfterText(str);
            } else {
                this.insertAfterText(str);
            }
        },
        getCursortPosition() { // 获取光标位置
            const textDom = this.$refs.textarea;
            let cursorPos = 0;
            if (document.selection) {
                textDom.focus();
                let selectRange = document.selection.createRange();
                selectRange.moveStart('character', - this.value.length);
                cursorPos = selectRange.text.length;
            } else if (textDom.selectionStart || textDom.selectionStart === 0) {
                cursorPos = textDom.selectionStart;
            }
            return cursorPos;
        },
        insertAfterText(value) { // 插入文本
            const textDom = this.$refs.textarea;
            let selectRange;
            if (document.selection) {
                textDom.focus();
                selectRange = document.selection.createRange();
                selectRange.text = value;
                textDom.focus();
            } else if (textDom.selectionStart || textDom.selectionStart === 0) {
                const startPos = textDom.selectionStart;
                const endPos = textDom.selectionEnd;
                const scrollTop = textDom.scrollTop;
                textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
                textDom.focus();
                textDom.selectionStart = startPos + value.length;
                textDom.selectionEnd = startPos + value.length;
                textDom.scrollTop = scrollTop;
            } else {
                textDom.value += value;
                textDom.focus();
            }
            this.$set(this, 'value', textDom.value);
        },
        setCaretPosition(position) { // 设置光标位置
            const textDom = this.$refs.textarea;
            if (textDom.setSelectionRange) {
                textDom.focus();
                textDom.setSelectionRange(position, position);
            } else if (textDom.createTextRange) {
                const range = textDom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', position);
                range.moveStart('character', position);
                range.select();
            }
        },
        insertLine() { // 插入分割线
            this.insertContent('\n----\n');
        },
        insertQuote() { // 引用
            this.insertContent('\n>  ');
        },
        insertUl() { // 无需列表
            this.insertContent('-  ');
        },
        insertOl() { // 有序列表
            this.insertContent('1. ');
        },
        insertFinished() { // 已完成列表
            this.insertContent('- [x]  ');
        },
        insertNotFinished() { // 未完成列表
            this.insertContent('- [ ]  ');
        },
        insertLink() { // 插入链接
            this.insertContent('\n[插入链接](https://github.com/coinsuper)');
        },
        insertImage() { // 插入图片
            this.insertContent('\n![image](https://noticejs.oss-cn-hangzhou.aliyuncs.com/%E6%9C%AA%E6%A0%87%E9%A2%98-3.jpg)');
        },
        insertTable() { // 插入表格
            this.insertContent('\nheader 1 | header 2\n---|---\nrow 1 col 1 | row 1 col 2\nrow 2 col 1 | row 2 col 2\n\n');
        },
        insertCode() { // 插入code
            const point = this.getCursortPosition();
            const lastChart = this.value.substring(point - 1, point);
            this.insertContent('\n```\n\n```');
            if (lastChart !== '\n' && this.value !== '') {
                this.setCaretPosition(point + 5);
            } else {
                this.setCaretPosition(point + 5);
            }
        },
        insertStrong() { // 粗体
            const point = this.getCursortPosition();
            const lastChart = this.value.substring(point - 1, point);
            this.insertContent('****');
            if (lastChart !== '\n' && this.value !== '') {
                this.setCaretPosition(point + 2);
            } else {
                this.setCaretPosition(point + 2);
            }
        },
        insertItalic() { // 斜体
            const point = this.getCursortPosition();
            const lastChart = this.value.substring(point - 1, point);
            this.insertContent('**');
            if (lastChart !== '\n' && this.value !== '') {
                this.setCaretPosition(point + 1);
            } else {
                this.setCaretPosition(point + 1);
            }
        },
        insertBg() { // 背景色
            const point = this.getCursortPosition();
            const lastChart = this.value.substring(point - 1, point);
            this.insertContent('====');
            if (lastChart !== '\n' && this.value !== '') {
                this.setCaretPosition(point + 5);
            } else {
                this.setCaretPosition(point + 5);
            }
        },
        insertUnderline() { // 下划线
            const point = this.getCursortPosition();
            const lastChart = this.value.substring(point - 1, point);
            this.insertContent('<u></u>');
            if (lastChart !== '\n' && this.value !== '') {
                this.setCaretPosition(point + 3);
            } else {
                this.setCaretPosition(point + 5);
            }
        },
        insertOverline() { // overline
            const point = this.getCursortPosition();
            const lastChart = this.value.substring(point - 1, point);
            this.insertContent('~~~~');
            if (lastChart !== '\n' && this.value !== '') {
                this.setCaretPosition(point + 2);
            } else {
                this.setCaretPosition(point + 2);
            }
        },
        insertTitle(level) { // 插入标题
            const titleLevel = {
                1 : '#  ',
                2 : '##  ',
                3 : '###  ',
                4 : '####  ',
                5 : '#####  ',
                6 : '######  '
            };
            this.insertContent(titleLevel[level]);
        },
        save(e) { // ctrl+s 保存
            e.preventDefault();
            this.handleSave(true);
        },
        tab(e) { // 屏蔽teatarea tab默认事件
            this.insertContent('    ', this);
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        async handleSave(isAuto=false) { // 保存操作
            const {documentId, isOnsave} = this;
            if (isOnsave) {
                return;
            }
            const {state : {userInfo : {id : ownerId}}} = this.$store;
            this.$emit('on-save', true);
            this.isOnsave = true;
           const res = await this.$post('/document/update', {
                id : documentId,
                ownerId,
                content : JSON.stringify({
                    markdownValue : this.value,
                    themeName : this.themeName
                })
            });
            if(res.resultCode&&!isAuto){
                this.$Message.success('保存成功！');
            }
            setTimeout(() => {
                this.$emit('on-save', false);
            }, 300);
            setTimeout(() => {
                this.isOnsave = false;
            }, 1000);
        },
        autoSave() {
            this.timerId = setInterval(() => {
                this.handleSave(true);
            },AUTO_SAVE_INTERVAL);
        },
        toggleSlideDown() { // 显示主题选项
            this.slideDown = ! this.slideDown;
        },
        setThemes(name) { // 设置主题
            this.themeName = name;
            this.themeSlideDown = false;
        },
        enter() { // 回车事件
            const {lastInsert} = this;
            const list = ['-  ', '1. ', '- [ ]  ', '- [x]  '];
            if (list.includes(lastInsert)) {
                this.insertContent(lastInsert);
            }
        },
        onDelete() { // 删除时,以回车为界分割，如果数组最后一个元素为''时，将行一次插入的共嗯那个置为空，避免回车时再次插入
            const lines = this.value.split('\n');
            if (lines[lines.length - 1] === '') {
                this.lastInsert = '';
            }
        },
        listener(e) {
            if (e.keyCode === 83) {
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    this.handleSave();
                }
            }
        },
        handleInsertImg(res) {
            const {path, originName} = res;
            const content = `\n![${originName}](${path})`;
            this.insertContent(content);
            this.showInsertImgModal = false;
        },

        exportMd() { // 导出为.md格式
            const {documentTitle, value} = this;
            saveFile(value, documentTitle + '.md');
            this.exportSlideDown = false;
        },
        importFile(e) {
            const file = e.target.files[0];
            if (! file) {
                return;
            }
            const {type} = file;
            if (type !== 'text/markdown') {
                this.$Notice.error('文件格式有误!');
                return;
            }
            const reader = new FileReader();
            reader.readAsText(file, {encoding : 'utf-8'});
            reader.onload = () => {
                this.value = reader.result;
                e.target.value = '';
            };
        },
    },
    watch : {
        value() {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.previewMarkdown = marked(this.value, {
                    sanitize : false
                });
            }, 30);
            this.indexLenth = this.value.split('\n').length;
            const height1 = this.indexLenth * 22;
            const height2 = this.$refs.textarea.scrollHeight;
            const height3 = this.$refs.preview.scrollHeight;
            this.scrollHeight = Math.max(height1, height2, height3);
            this.indexLenth = parseInt(this.scrollHeight / 22,0)-1;
        },
        async documentId() {
            this.value = '';
            const id = this.documentId;
            const res = await this.$post('/document/detail', {
                id
            });
            const {resultCode, data : {content}} = res;
            if (resultCode) {
                if (content) {
                    this.value = JSON.parse(content).markdownValue;
                    this.themeName = JSON.parse(content).themeName;
                    setTimeout(() => {
                        this.insertContent(' ');
                    }, 1000);
                }
            }
        }
    },
    destroyed() { // 销毁时清除定时器
        clearInterval(this.timerId);
    }
};
