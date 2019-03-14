import axios from 'axios';
import {stringify} from 'qs';
import {BASE_URL} from '../constant';
import {Notice} from 'iview';

class Request {
    get(url, option) {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_URL}${url}?${stringify(option)}`).then(res => {
                resolve(res.data);
            }, err => {
                reject(err);
            });
        });
    }

    post(url, option = {}, userConfig={}) {
        const {config={}, tost = false} = userConfig ;
        return new Promise((resolve, reject) => {
            axios.post(BASE_URL + url, option, {
                ...config,
                timeout:10000
            }).then(res => {
                const {data : {resultCode, resultMsg}} = res;
                if (! resultCode) {
                    Notice.error({
                        title : '提示',
                        desc : resultMsg
                    });
                }
                if (tost && resultCode) {
                    Notice.success({
                        title: '提示',
                        desc: resultMsg
                    });
                }
                resolve(res.data);
            }, err => {
                reject(err);
            });
        });
    }
}

export default Request;
