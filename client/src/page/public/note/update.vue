<template>
    <div class="update-note">
        <Ueditor id="note" :documentId="documentId" />
    </div>
</template>

<script>
    import Ueditor from '../../../components/ueditor';

    export default {
        name: 'update',
        components: {
            Ueditor
        },
        data() {
            return {
                documentId: ''
            };
        },
        mounted() {
            const { params: { id } } = this.$route;
            this.documentId = id;
            this.addListener();
        },
        methods:{
            addListener(){
                document.addEventListener('keydown',e=>{
                    if (e.keyCode === 83) {
                        if (e.metaKey || e.ctrlKey) {
                            e.preventDefault();
                        }
                    }
                },true)
            }
        },
    };
</script>

<style scoped lang="less">
    .update-note {
        min-height: 90vh;
    }
</style>
