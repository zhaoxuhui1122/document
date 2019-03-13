
/* * 校验必填参数是否为空
 * @params {Object} 需要校验的对象
 * @keys {Array} 必填字段的集合
 * */

export const checkRequired = (params, keys) => {
    if (keys.constructor != Array) {
        return
    }
    let result = true; // 所有必填参数是否已填
    let paramsKeys = Object.keys(params);
    let noneKeys = []; // 缺少的keys
    keys.forEach(item => {
        if (! paramsKeys.includes(item) || params[item] === '' || params[item] == 'undefined') {
            result = false;
            noneKeys.push(item);
        }
    })
    return {result, noneKeys};
}

/* *md5 加密
 *@string { String }需要加密的数据
 * */
import md5 from 'md5'
import {MD5_KEY} from './/utils'

export const MD5 = string => {
    return md5(md5(string + MD5_KEY) + MD5_KEY);
}

/* *返回值包装
 * */
export const setResponseData = (resultCode, resultMsg, data = [], others = {}) => {
    return {
        resultCode,
        resultMsg,
        data,
        ...others
    }
}

/*
 *saveDate 创建一条数据
 *@data {}
 */
export function saveDate(data) {
    return new Promise(resolve => {
        data.save((err, doc) => {
            if (err) {
                resolve({
                    success : false
                })
                return;
            }
            resolve({
                success : true,
                data : doc
            })
        })
    })
}

/*
 *hasData 是含有符合条件的数据
 */
export function hasData(model, limit = {}) {
    return new Promise(resolve => {
        model.find(limit, (err, list) => {
            if (err) {
                resolve(false);
                return;
            }
            if (list.length>0) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}

/*
 *findById 根据id查询数据
 *@model {}
 *@_id {String} id
 */
export function findById(model, _id) {
    return new Promise(resolve => {
        model.findById({_id}, (err, doc) => {
            if (err) {
                resolve({
                    success : false
                })
                return;
            }
            if(doc){
                resolve({
                    success : true,
                    data : doc
                })
            }else{
                resolve({
                    success : false
                })
            }

        })
    })
}

/*
 * queryCount 查询符合条件数据条数
 */
export function queryCount(model, limit = {}) {
    return new Promise(resolve => {
        model.count({}, (err, count) => {
            if (err) {
                resolve(0)
            } else {
                resolve(count);
            }
        })
    })
}

/*
 *updateById 根据id更新数据
 *@model {}
 *@_id {String} id
 *@options {Object} 更新的数据
 */

export function updateById(model, limit = {}, options = {}) {
    return new Promise(resolve => {
        model.updateOne(limit, {
            ...options,
            updateAt : Date.now()
        }, (err, doc) => {
            if (err) {
                resolve({
                    success : false
                })
                return
            }
            resolve({
                success : true
            })
        })
    })
}

/*
 *updateMany 更新多个文档
 */
export function updateMany(model, limit = {}, options = {}) {
    return new Promise(resolve => {
        model.updateMany(limit, options, err => {
            if (err) {
                resolve({
                    success : false
                })
            } else {
                resolve({
                    success : true
                })
            }
        })
    })
}


/*
 *removeById 根据id删除数据
 */
export function removeById(model, _id) {
    return new Promise(resolve => {
        model.deleteOne({_id}, err => {
            if (err) {
                const {message = ''} = err;
                resolve({
                    success : false,
                    errMsg : message
                })
                return
            }
            resolve({
                success : true
            })
        })
    })
}

/*
 *removeMany 删除多个文档
 */
export function removeMany(model, limit, options = {}) {
    return new Promise(resolve => {
        model.deleteMany(limit, err => {
            if (err) {
                resolve({
                    success : false
                })
            } else {
                resolve({
                    success : true
                })
            }
        })
    })
}

/*
 *removeALl 删除所有
 */
export function removeAll(model, userId) {
    return new Promise(resolve => {
        model.deleteMany({
            userId,
            status : '1'
        }, err => {
            if (err) {
                resolve({
                    success : false
                })
            } else {
                resolve({
                    success : true
                })
            }
        })
    })
}

/*
* 计算文档内所有html文件路径
* */
let htmlList = [];
function htmlPath(list) {
    list.forEach(item=>{
        const {path,children} = item ;
        if(item.children){
            return htmlPath(children);
        }else{
            if(/\.html/g.test(path)&&!/__MACOSX/.test(path)){
                return htmlList.push(path.replace(/^tmp/,'/static/product')) ;
            }
        }
    })
}
export function getHtmlPath(list) {
    htmlPath(list);
    return htmlList;
}
