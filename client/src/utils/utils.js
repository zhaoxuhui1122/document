import {parse} from 'qs';
/*
 * 根据索引删除数组内某条数据
 * */
export function deleteOnInListByIndex(list, index) {
    let newArr = [];
    list.forEach((item, _index) => {
        if (_index !== index) {
            newArr.push(item);
        }
    });
    return newArr;
}

/*
 * 根s属性引删除数组内某条数据
 * */

export function deleteOnInList(list, prototype,value) {
    let newArr = [];
    list.forEach(item => {
        if (item[prototype] !== value) {
            newArr.push(item);
        }
    });
    return newArr;
}

/*
* 计算文档所有路径
* */
let htmlList = [];
function defaultIndex(list) {
    list.forEach(item=>{
        const {path,children} = item ;
        if(item.children){
            return getDefaultIndex(children);
        }else if(/\.html/g.test(path)){
            return htmlList.push(path) ;
        }
    });
}
export function getDefaultIndex(list) {
    defaultIndex(list);
    return htmlList;
}
/*
* 保存文件到本地
* */
export function saveFile(file_data, name) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(file_data));
    pom.setAttribute('download', name);
    pom.style.display = 'none';
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

/*
* 获取url里的参数
* */
export function getLocationParams() {
    const {location : {search}} = window;
    return parse(search.replace(/^\?/, ''));
}
