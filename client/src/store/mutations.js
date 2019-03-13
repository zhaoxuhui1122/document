// mutations
import Cookies from 'js-cookie';

export default {
    setLogin(state) {// 设置登录状态
        state.isLogin = true;
        Cookies.set('USER_LOGIN', true, {expires : 30});
    },
    setLogout(state) {// 退出
        state.isLogin = false;
        Cookies.remove('USER_LOGIN');
    },
    setUserInfo(state,payload) {
        state.userInfo = payload;
        Cookies.set('USER_INFO',payload,{expires : 30});
    }
};
