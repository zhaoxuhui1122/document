<template>
    <div>
        <Markdown :height="height" :documentId="documentId"/>
    </div>
</template>

<script>
    import Markdown from '../../../components/markdown/index';

    export default {
        name : 'update',
        components : {
            Markdown
        },
        computed:{
            height(){
                return parseInt(window.innerHeight-60,0);
            }
        },
        data(){
            return {
                documentId:''
            };
        },
        mounted(){
            const {params:{id}} = this.$route ;
            this.documentId = id ;
        }
    };
</script>

<style scoped lang="less">

</style>
