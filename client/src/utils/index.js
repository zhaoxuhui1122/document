import Request from './request' ;
import moment from 'moment';
import loading from '../components/loading/index';
import contextmenu from '../components/contextmenu';
import API from '../config/api';

export default {
    install(vm) {
        vm.prototype.$http = new Request();
        vm.prototype.$get = new Request().get;
        vm.prototype.$post = new Request().post;
        vm.prototype.$moment = moment ;
        vm.prototype.$Loading = loading;
        vm.prototype.$Contextmenu = contextmenu;
        vm.prototype.$API = API;
    }
};
