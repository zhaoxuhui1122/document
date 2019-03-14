// state
import Cookie from 'js-cookie';

const Cookies = {
    get(name) {
        const res = Cookie.get(name);
        if (res) {
            return JSON.parse(res);
        } else {
            return res;
        }
    }
};
export default {
    isLogin : Cookies.get('USER_LOGIN'),
    userInfo : Cookies.get('USER_INFO'),
};
