import { PAGE_SIZE } from '../constant/';

export default {
    name: 'mixin-pagination',
    data() {
        return {
            list: [],
            loading: true,
            current: 1,
            pageSize: PAGE_SIZE,
            total: 0,
        };
    },
    methods: {
        handlePageSizeChange(pageSize) { // 分页条数改变
            this.pageSize = pageSize;
            this.queryList();
        },
        handlePagination(num) { // 分页操作
            this.queryList(num);
        }
    }
};
