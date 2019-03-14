import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import utils from './utils';
import './assets/css/reset.less';
import './assets/css/iview.css';
import './components/iview';

Vue.config.productionTip = false;
Vue.use(utils);
import '../static/editor/neditor.config';
import '../static/editor/neditor.all';
import '../static/editor/i18n/zh-cn/zh-cn';
/* eslint-disable no-new */
new Vue({
    el : '#app',
    router,
    store,
    components : {App},
    template : '<App/>'
});
