<template>
    <Card>
        <div slot="title">
            <Breadcrumb>
                <BreadcrumbItem to="/document/public">公共文档</BreadcrumbItem>
                <BreadcrumbItem>{{ dirName }}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div slot="extra">
            <div class="extra">
                <Select v-model="searchItem" filterable remote :remote-method="handleSearch" :loading="onSearch" placeholder="搜索...">
                    <Option v-for="(item,index) in searchresults" :value="JSON.stringify(item)" :key="index">{{item.title}}</Option>
                </Select>
                <Dropdown style="margin-left: 20px" @on-click="handleDropdownChange">
                    <Button type="primary">
                        新增
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="1">笔记</DropdownItem>
                        <DropdownItem name="2">Markdown</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <ul class="paved" v-show="list.length>0">
            <li
                :class="item.type===1?'icon-note':'icon-markdown'"
                v-for="(item,index) in list" :key="index"
                @click="handleChangeRouter(item)"
                @contextmenu.prevent="handleContextmenu(item,$event)">
                <div class="icon icon-note"></div>
                <h3>{{ item.title }}</h3>
            </li>
            <li class="load-more" v-show="hasMore" @click="queryList(current + 1, type)">
                <p>加载更多</p>
            </li>
        </ul>
        <no-result v-show="noResult"/>
        <Modal
            v-model="visible"
            title="标题"
        >
            <input placeholder="请输入标题" v-model="title" @keyup.enter="handleCreateDocument"/>
            <div slot="footer">
                <Button type="primary" long :disabled="!title" @click="handleCreateDocument">提交</Button>
            </div>
        </Modal>
    </Card>
</template>

<script>
    import {PAGE_SIZE} from '../../constant';
    import {deleteOnInList, getLocationParams} from '../../utils/utils';
    import NoResult from '../../components/NoResult';

    export default {
        name : 'docList',
        components:{
            NoResult
        },
        data() {
            return {
                visible : false,
                title : '',
                type : '',//文档类型
                keywords : '',//关键字
                list : [],
                total : 0,
                hasMore : false,
                isUpdate : false,
                documentId : '',
                dirName : '',// 父级文件夹名字
                noResult:false,
                searchresults: [],
                searchItem: '',
                onSearch: false
            };
        },
        computed : {
            directoryId() { // 所属文件夹id
                const {params : {id}} = this.$route;
                return id;
            }
        },
        mounted() {
            this.queryList();
            const {query:{dirName}} = this.$route;
            this.dirName = dirName;
        },
        methods : {
            handleSearch(keywords) {
                const { timerId } = this;
                const {params : {id}} = this.$route;
                if (!keywords) {
                    this.searchresults = [];
                    this.searchItem = '';
                    return;
                }
                clearTimeout(timerId);
                this.timerId = setTimeout(async () => {
                    this.onSearch = true;
                    const res = await this.$post(this.$API.queryDocumentList, {
                        keywords,
                        directoryId:id,
                        status: '0'
                    });
                    this.onSearch = false;
                    if (res.resultCode) {
                        const { data = [] } = res;
                        this.searchresults = data;
                    }
                }, 300);
            },
            async queryList(pageNum = 1) { // 查询列表
                const {keywords, title, list = []} = this;
                const {params : {id : directoryId}} = this.$route;
                this.loading = true;
                this.current = pageNum;
                const res = await this.$post(this.$API.queryDocumentList, {
                    pageSize : PAGE_SIZE,
                    pageNum,
                    title,
                    keywords,
                    status : '0',
                    directoryId
                });
                this.loading = false;
                const {resultCode, data, total} = res;

                if (resultCode) {
                    this.list = [
                        ...list,
                        ...data
                    ];
                    this.total = total;
                    if (this.list.length<total) {
                        this.hasMore = true;
                    } else {
                        this.hasMore = false;
                    }
                    if(total>0){
                        this.noResult = false ;
                    }else{
                        this.noResult = true ;
                    }
                }
            },
            async handleCreateDocument() { // 新增文档
                const {type, title, isUpdate} = this;
                const {params : {id : directoryId}} = this.$route;
                const {state : {userInfo : {id : userId}}} = this.$store;
                if (isUpdate) {
                    this.handleRename();
                    return;
                }
                const res = await this.$post(this.$API.createDocument, {
                    title,
                    content : '',
                    type : type.toString(),
                    userId,
                    status : '0',
                    directoryId
                });
                if (res.resultCode) {
                    const {data : {_id}} = res;
                    const {dirName} = getLocationParams();
                    const {params : {id}} = this.$route;

                    const routers = {
                        1 : `/note/update/${_id}`,
                        2 : `/markdown/update/${_id}`,
                    };
                    this.$router.push({
                        path : routers[type],
                        query : {
                            dirName,
                            directoryId:id
                        }
                    });
                }
            },
            handleDropdownChange(type) { // 新建文档时下拉菜单变化
                this.title = '';
                this.visible = true;
                this.type = type;
            },
            handleChangeRouter(item) {// 跳页
                const {_id, type} = item;
                const {dirName} = getLocationParams();
                const {params : {id : directoryId}} = this.$route;
                const routers = {
                    1 : `/note/preview/${_id}`,
                    2 : `/markdown/preview/${_id}`,
                };
                this.$router.push({
                    path : routers[type],
                    query : {dirName, directoryId}
                });
            },
            handleContextmenu(detail, e) { // 菜单右键
                e.preventDefault();
                const top = e.pageY;
                const left = e.pageX;
                let menuList = [
                    {id : 'showRenameModal', name : '重命名'},
                    {id : 'handleModify', name : '编辑'},
                    {id : 'handleChangeRouter', name : '查看详情'},
                    {id : 'handleDelete', name : '删除'}
                ];
                this.$Contextmenu.init({
                    left,
                    top,
                    data : menuList,
                    onClick : (item) => {
                        const {id} = item;
                        this[id](detail);
                    }
                });
            },
            showRenameModal(detail) { // 修改标题
                this.visible = true;
                this.isUpdate = true;
                const {title, _id} = detail;
                this.title = title;
                this.documentId = _id;
            },
            async handleRename() { // 重命名
                const {title, documentId, list} = this;
                const res = await this.$post(this.$API.updateDocument, {
                    id : documentId,
                    title
                }, {tost : true});
                if (res.resultCode) {
                    this.visible = false;
                    this.isUpdate = false;
                    this.documentId = '';
                    this.title = '';
                    this.list = list.map(item => {
                        if (item._id === documentId) {
                            return {
                                ...item,
                                title
                            };
                        }
                        return item;
                    });
                }
            },
            handleModify(item) { // 跳转到编辑
                const {_id, type} = item;
                const {dirName} = getLocationParams();
                const {params : {id : directoryId}} = this.$route;
                const routers = {
                    1 : `/note/update/${_id}`,
                    2 : `/markdown/update/${_id}`,
                };
                this.$router.push({
                    path : routers[type],
                    query : {dirName, directoryId}
                });
            },
            handleDelete(item) {
                const {_id, title} = item;
                this.$Modal.confirm({
                    title : '提示',
                    content : `确定删除【${title}】吗？`,
                    onOk : async () => {
                        const res = await this.$post(this.$API.updateDocument, {
                            id : _id,
                            status:1
                        }, {tost : true});
                        if (res.resultCode) {
                            const {list = []} = this;
                            this.list = deleteOnInList(list, '_id', _id);
                            if(this.list.length===0){
                                this.queryList();
                            }
                        }
                    }
                });
            }
        },
        watch:{
            searchItem() {
                const { searchItem ,dirName} = this;
                if (!searchItem) {
                    return;
                }
                const { type, _id, directoryId } = JSON.parse(searchItem);
                const types = {
                    1: '/note/preview',
                    2: '/markdown/preview'
                };
                this.$router.push({
                    path: `${types[type]}/${_id}`,
                    query : {dirName, directoryId}
                });
            }
        }
    };
</script>

<style scoped lang="less">
    @import '../../assets/css/theme.less';
    @import '../../assets/css/common.less';

    .directory-list {
        .icon {
            background-size: contain;
        }

    }
    .extra {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .ivu-btn {
            margin-left: 12px;
        }
    }
    input {
        display: block;
        width: 100%;
        height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        color: #515a6e;
        background-color: @white;
        background-image: none;
        position: relative;
        cursor: text;
        transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
        &:focus {
            border-color: #57a3f3;
        }
    }
</style>
