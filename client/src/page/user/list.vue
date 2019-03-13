<template>
    <div class="user-list">
        <Card title="用户列表">
            <div slot="extra">
                <router-link to="/user/create">
                    <Button type="primary">新增</Button>
                </router-link>
            </div>
            <div style="min-height:60vh;">
                <Table :columns="columns" :data="list" :loading="loading"/>
                <Pagination @on-pageSize-change="handlePageSizeChange" :current="current" :total="total"
                            @on-change="handlePagination" showElevator/>
            </div>
        </Card>
    </div>
</template>

<script>
    import Pagination from '../../components/Pagination';
    import pagination from '../../mixins/pagination';
    import {deleteOnInList} from '../../utils/utils';
    import {USER_TYPES} from '../../constant';

    export default {
        name : 'user-list',
        components : {
            Pagination
        },
        mixins : [pagination],
        data() {
            return {
                columns : [{
                    title : '序号',
                    type : 'index',
                    width : 80,
                    align : 'center'
                }, {
                    title : '用户名',
                    key : 'name'
                }, {
                    title : '邮箱号',
                    key : 'email'
                }, {
                    title : '用户类型',
                    key : 'type',
                    width:120,
                    render : (h, data) => {
                        const {row : {type = 0}} = data;
                        return h('span', this.userTypes[type]);
                    }
                }, {
                    title : '用户状态',
                    key : 'status',
                    width:120,
                    render : (h, data) => {
                        const {row : {status = 0}} = data;
                        return status===0?h('span', this.userStatus[status]): h('Tag',{
                            props:{
                                color:'orange'
                            }
                        }, this.userStatus[status]);
                    }
                }, {
                    title : '操作',
                    key : 'handle',
                    className:'handle',
                    render : (h, data) => {
                        const {row : {status = 0, _id}} = data;
                        return h('div', [
                            h('Button', {
                                props : {
                                    size : 'small',
                                    type : 'primary'
                                },
                                style : {
                                    display : status === 0 ? 'inline-block': 'none'
                                },
                                on : {
                                    click : () => {
                                        this.handleChangeUserStatus(_id, 1);
                                    }
                                }
                            }, '冻结'),

                            h('Button', {
                                props : {
                                    size : 'small',
                                    type : 'primary'
                                },
                                style : {
                                    display : status === 1 ? 'inline-block': 'none'
                                },
                                on : {
                                    click : () => {
                                        this.handleChangeUserStatus(_id, 0);
                                    }
                                }
                            }, '解冻'),
                            h('Button', {
                                props : {
                                    size : 'small',
                                    type : 'primary'
                                },
                                on : {
                                    click : () => {
                                        this.$router.push({
                                            path:`/user/update/${_id}`
                                        })
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props : {
                                    size : 'small',
                                    type : 'error'
                                },
                                on : {
                                    click : () => {
                                        this.handleRemoveUser(_id);
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }],

                userTypes : USER_TYPES,
                userStatus : {
                    0 : '正常',
                    1 : '冻结'
                }
            };
        },
        mounted() {
            this.queryList();
        },
        methods : {
            async queryList(pageNum = 1) {
                const {pageSize} = this;
                this.loading = true;
                this.current = pageNum;
                const res = await this.$post(this.$API.userList, {
                    pageNum,
                    pageSize
                });
                this.loading = false;
                if (res.resultCode) {
                    const {data = [], total = 0} = res;
                    this.list = data;
                    this.total = total;
                }
            },
            async handleChangeUserStatus(id, status = 0) {
                const res = await this.$post(this.$API.userUpdate, {
                    id,
                    status
                }, {tost : true});
                if (res.resultCode) {
                    const {list} = this;
                    this.list = list.map(item => {
                        if (item._id === id) {
                            return {
                                ...item,
                                status
                            };
                        } else {
                            return {
                                ...item
                            };
                        }
                    });
                }
            },
            handleRemoveUser(id) {
                this.$Modal.confirm({
                    title : '提示',
                    content : '确定删除该用户吗？',
                    onOk : async () => {
                        const res = await this.$post('/User/remove', {id}, true);
                        if (res.resultCode) {
                            const {list = []} = this;
                            this.list = deleteOnInList(list, '_id', id);
                        }
                    }
                });
            }
        }
    };
</script>

<style scoped lang="less">
    td.handle{
        white-space: nowrap;
    }
</style>
