<template>
    <div id="app" :class="isUpdatemarkdown?'update-markdown':''">
        <router-view />
    </div>
</template>
<script>
    export default {
        name: 'App',
        computed: {
            isUpdatemarkdown() {
                const { name } = this.$route;
                if (name === 'markdown-update') {
                    return true;
                }
                return false;
            }
        }
    };
</script>

<style>

</style>
