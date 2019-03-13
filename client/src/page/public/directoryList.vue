<template>
    <div class="product-list">
        <Card title="公共文档">
            <div slot="extra">
                <div class="extra">
                    <Select v-model="searchItem" filterable remote :remote-method="handleSearch" :loading="onSearch" placeholder="搜索...">
                        <Option v-for="(item,index) in searchresults" :value="JSON.stringify(item)" :key="index">{{item.title}}</Option>
                    </Select>
                    <Button type="primary" @click="visible=true;isUpdate=false;directoryName=''">新增文件夹</Button>
                </div>
            </div>
            <ul class="directory-list">
                <li v-for="(item,index) in list" :key="index" @click="handleChangeRoute(item)" @contextmenu.prevent="handleContextmenu(item,$event)">
                    <div class="icon"></div>
                    <div class="msg">
                        <h3>{{ item.name }}</h3>
                    </div>
                </li>
                <li class="directory-rubbishs" @click="$router.push({path:'/document/rubbish'})">
                    <div class="icon"></div>
                    <div class="msg">
                        <h3>回收站</h3>
                    </div>
                </li>
                <li class="load-more" @click="queryList(current+1)" v-show="hasMore">
                    <Icon type="ios-loading" />
                    <p>加载更多</p>
                </li>
            </ul>
            <no-result v-show="noResult" />
        </Card>
        <!--新建文件夹-->
        <Modal v-model="visible" :title="isUpdate?'修改文件夹':'新增文件夹'">
            <div class="modal-content">
                <input placeholder="请输入文件夹名称" v-model="directoryName" @keyup.enter="sUpdate?handleUpdateDirectory():handleCreateDirectory()" />
            </div>
            <div slot="footer">
                <Button type="primary" @click="isUpdate?handleUpdateDirectory():handleCreateDirectory()" long>确定
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { PAGE_SIZE } from '../../constant';
    import { deleteOnInList } from '../../utils/utils';
    import NoResult from '../../components/NoResult';

    export default {
        name: 'product-list',
        components: {
            NoResult
        },
        data() {
            return {
                visible: false,
                directoryName: '',
                list: [],
                total: 0,
                current: 1,
                loading: true,
                isUpdate: false,
                directoryId: '',
                hasMore: false,
                noResult: false,
                timerId: null,
                searchresults: [],
                searchItem: '',
                onSearch: false
            };
        },
        mounted() {
            this.queryList();
        },
        methods: {
            handleSearch(keywords) {
                const { timerId } = this;
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
                        status: '0'
                    });
                    this.onSearch = false;
                    if (res.resultCode) {
                        const { data = [] } = res;
                        this.searchresults = data;
                    }
                }, 300);
            },
            async queryList(pageNum = 1) { // 查询文件夹列表
                this.current = pageNum;
                this.loading = true;
                const { list = [] } = this;
                const res = await this.$post(this.$API.queryDirList, {
                    type: 1,
                    pageNum,
                    pageSize: PAGE_SIZE
                });
                this.loading = false;
                if (res.resultCode) {
                    const { total = 0, data = [] } = res;
                    this.total = total;
                    this.total = total;
                    this.list = [
                        ...list,
                        ...data
                    ];
                    if (this.list.length < total) {
                        this.hasMore = true;
                    } else {
                        this.hasMore = false;
                    }
                    if (total > 0) {
                        this.noResult = false;
                    } else {
                        this.noResult = true;
                    }
                }
            },
            async handleCreateDirectory() { // 创建文件夹
                const { directoryName } = this;
                if (!directoryName) {
                    this.$Message.error('请输入项目名称');
                    return;
                }
                const res = await this.$post(this.$API.createDir, {
                    type: 1,
                    name: directoryName
                }, true);
                if (res.resultCode) {
                    const { data } = res;
                    const { list } = this;
                    this.list = [
                        data,
                        ...list
                    ];
                    this.visible = false;
                }
            },
            handleChangeRoute(item) { // 跳转路由
                const { _id, name } = item;
                this.$router.push({
                    path: `/document/directory/${_id}`,
                    query: {
                        dirName: name
                    }
                });
            },
            async handleDeleteDirectory(item) { // 删除文件夹
                const { list } = this;
                const { _id } = item;
                this.$Modal.confirm({
                    title: '警告',
                    content: '确定删除该文件夹及内部所有文件吗？',
                    onOk: async () => {
                        const res = await this.$post(this.$API.removeDir, { id: _id }, { tost: true });
                        if (res.resultCode) {
                            this.list = deleteOnInList(list, '_id', _id);
                            if (this.list.length === 0) {
                                this.queryList();
                            }
                        }
                    }
                });
            },
            async handleUpdateDirectory() { // 重命名文件夹
                const { directoryName, directoryId, list = [] } = this;
                const res = await this.$post(this.$API.updateDir, {
                    id: directoryId,
                    name: directoryName
                }, { tost: true });
                if (res.resultCode) {
                    this.visible = false;
                    this.directoryId = '';
                    this.directoryName = '';
                    this.list = list.map(item => {
                        if (item._id === directoryId) {
                            return {
                                ...item,
                                name: directoryName
                            };
                        }
                        return item;
                    });
                }
            },
            handleContextmenu(detail, e) { // 菜单右键
                e.preventDefault();
                const top = e.pageY;
                const left = e.pageX;
                let menuList = [
                    { id: 'showRenameModal', name: '重命名' },
                    { id: 'handleDeleteDirectory', name: '删除' }
                ];
                this.$Contextmenu.init({
                    left,
                    top,
                    data: menuList,
                    onClick: (item) => {
                        const { id } = item;
                        this[id](detail);
                    }
                });
            },
            showRenameModal(detail) {
                const { name, _id } = detail;
                this.visible = true;
                this.isUpdate = true;
                this.directoryName = name;
                this.directoryId = _id;
            }
        },
        watch: {
            searchItem() {
                const { searchItem, list } = this;
                if (!searchItem) {
                    return;
                }
                const { type, _id, directoryId } = JSON.parse(searchItem);
                const types = {
                    1: '/note/preview',
                    2: '/markdown/preview'
                };
                const { name = '-' } = list.find(item => {
                    return item._id === directoryId;
                });
                this.$router.push({
                    path: `${types[type]}/${_id}`,
                    query: {
                        dirName: name,
                        directoryId
                    }
                });
            }
        }
    };
</script>

<style scoped lang="less">
    @import '../../assets/css/theme.less';
    @import '../../assets/css/common.less';

    .product-list {
        .extra {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .ivu-btn {
                margin-left: 12px;
            }
        }

        .directory-list li {
            .bottom {
                display: flex;
                justify-content: flex-end;
                align-items: center;

                p {
                    flex: 1;
                }

                span {
                    padding: 0 4px;
                    opacity: 0;
                }
            }

            &:hover {
                span {
                    opacity: 1;

                    &.update-icon {
                        color: @primary;
                    }

                    &.delete-icon {
                        color: @error;
                    }
                }
            }
            &.directory-rubbishs{
                .icon{
                    background: url("../../../static/img/directory_rubbish.png") no-repeat;
                    background-size: contain;
                }
            }
        }
    }

    .modal-content {
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
    }
</style>
