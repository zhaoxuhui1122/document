import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

Vue.use(Router);

const router = new Router({
    mode:'history',
    routes: [{
                 path: '/',
                 name: 'home',
                 redirect: '/document/product',
                 component: () => import('../page/layout.vue'),
                 meta: {
                     login: true
                 },
                 children: [{
                     path: '/document/product',
                     name: 'product-list',
                     component: () => import('../page/product/productList.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/document/product/create',
                     name: 'product-create',
                     component: () => import('../page/product/form.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/document/product/update/:id',
                     name: 'product-update',
                     component: () => import('../page/product/form.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/document/product/:id',
                     name: 'product-detail',
                     component: () => import('../page/product/detail.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/document/ui',
                     name: 'ui-list',
                     component: () => import('../page/product/uiList.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/document/public',
                     name: 'public-list',
                     component: () => import('../page/public/directoryList.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/document/directory/:id',
                     name: 'public-detail',
                     component: () => import('../page/public/docList.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/document/rubbish',
                     name: 'public-rubbish',
                     component: () => import('../page/public/rubbish.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/markdown/preview/:id',
                     name: 'markdown-preview',
                     component: () => import('../page/public/markdown/preview.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/markdown/update/:id',
                     name: 'markdown-update',
                     component: () => import('../page/public/markdown/update.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/note/preview/:id',
                     name: 'note-preview',
                     component: () => import('../page/public/note/preview.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/note/update/:id',
                     name: 'note-update',
                     component: () => import('../page/public/note/update.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/user/list',
                     name: 'user-list',
                     component: () => import('../page/user/list.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/user/create',
                     name: 'user-create',
                     component: () => import('../page/user/sub/form.vue'),
                     meta: {
                         login: true
                     },
                 }, {
                     path: '/user/update/:id',
                     name: 'user-uodate',
                     component: () => import('../page/user/sub/form.vue'),
                     meta: {
                         login: true
                     },
                 }]
             },
             {
                 path: '/login',
                 name: 'login',
                 component: () => import('../page/login.vue'),
                 meta: {
                     login: false
                 }
             },
             {
                 path: '/user/findPassword',
                 name: 'user-findPassword',
                 component: () => import('../page/findPassword.vue'),
                 meta: {
                     login: false
                 },
             },
             {
                 path: '*',
                 name: 'error',
                 component: () => import('../page/404.vue'),
                 meta: {
                     login: false
                 }
             }
    ]
});
router.beforeEach((to, from, next) => {
    const { meta: { login } } = to;
    const { state: { isLogin } } = store;
    if (login && !isLogin) {
        router.push({
            path: '/login'
        });
        return;
    }
    next();
});
export default router;
