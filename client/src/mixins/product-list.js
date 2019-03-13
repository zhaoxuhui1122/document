import {PAGE_SIZE} from '../constant';
import NoResult from '../components/NoResult';

export default {
    name : 'product-list',
    components:{
        NoResult
    },
    data() {
        return {
            visible : false,
            modalTitle : '新增项目',
            projectName : '',
            list : [],
            total : 0,
            current : 1,
            loading : true,
            hasMore:false,
            noResult:false
        };
    },
    computed:{
        type(){
            const {name} = this.$route ;
            if(name==='ui-list'){
                return 2 ;
            }else{
                return 1 ;
            }
        }
    },
    mounted() {
        this.queryList();
    },
    methods : {
        async queryList(pageNum = 1) {
            const {type,list} = this ;
            this.current = pageNum;
            this.loading = true;
            const res = await this.$post(this.$API.queryProductList, {
                type ,
                pageNum,
                pageSize : PAGE_SIZE
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
                if(total===0){
                    this.noResult = true ;
                }else{
                    this.noResult = false;
                }
            }
        },
        handleChangeRoute(item){
            const {_id,name} = item ;
            this.$router.push({
                path:`/document/product/${_id}`
            });
        }
    }
};
