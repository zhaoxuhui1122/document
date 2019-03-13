<template>
    <div class="ui-list">
        <Card title="UI设计稿">
            <div slot="extra">
                <router-link :to="{path:`/document/product/create`,query:{type:2}}">
                    <Button type="primary">新增项目</Button>
                </router-link>
            </div>
            <ul class="directory-list">
                <li v-for="(item,index) in list" :key="index"
                    @click="handleChangeRoute(item)">
                    <div class="icon"></div>
                    <div class="msg">
                        <h3>{{ item.name }}</h3>
                        <p>{{ $moment(item.updateAt).format('YYYY-MM-DD HH:mm') }}</p>
                    </div>
                </li>
                <li class="load-more" @click="queryList(current+1)" v-show="hasMore">
                    <Icon type="ios-loading"/>
                    <p>加载更多</p>
                </li>
            </ul>
            <no-result v-show="noResult"/>
        </Card>
    </div>
</template>

<script>
    import list from '../../mixins/product-list';

    export default {
        mixins : [list]
    };

</script>

<style scoped lang="less">
    @import '../../assets/css/theme.less';
    @import '../../assets/css/common.less';

</style>
