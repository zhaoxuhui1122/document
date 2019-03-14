<template>
    <div class="pagination">
        <Select style="width: 100px;margin-right: 20px;" v-model="pageSize">
            <Option :value="20">20条/页</Option>
            <Option :value="50">50条/页</Option>
            <Option :value="100">100条/页</Option>
        </Select>
        <Page :current="current" :total="total" :show-elevator="showElevator" @on-change="onChange"
              :page-size="pageSize"></Page>
    </div>
</template>

<script>
    import {PAGE_SIZE} from '../constant';

    export default {
        name : 'pagination',
        props : {
            total : Number,
            showElevator : {
                type : Boolean,
                default : false
            },
            current : {
                type : Number,
                default : 1
            }
        },
        data() {
            return {
                pageSize : PAGE_SIZE,

            };
        },
        methods : {
            onChange(res) {
                this.$emit('on-change', res);
            }
        },
        watch : {
            pageSize() {
                const {pageSize} = this;
                this.$emit('on-pageSize-change', pageSize);
            }
        }
    };
</script>

<style scoped lang="less">
    .pagination {
        display: flex;
        justify-content: flex-end;
        padding: 30px 20px;
        padding-bottom: 200px;
    }

</style>
