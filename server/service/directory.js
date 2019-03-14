import Directory from '../mongodb/directory';
import Document from '../mongodb/document';
import {checkRequired, setResponseData, saveDate, hasData, removeById, removeMany,updateById} from '../utils/utils';
import {SUCCESS_CODE, SUCCESS_MSG, ERROR_CODE, ERROR_MSG} from '../utils/constant';


// 创建文件夹
export const createDirectory = async (ctx, next) => {
    const {body} = ctx.request;
    const {result, noneKeys} = checkRequired(body, ['name', 'type']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const {name, type} = body;
    const directory = new Directory({
        name,
        type
    })
    const hasName = await hasData(Directory, {name});
    if (hasName) {
        ctx.body = setResponseData(ERROR_CODE, `已有相同名称的项目！`);
        return;
    }
    const save = await saveDate(directory);
    if (save.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, save.data);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}
/*
* 更新文件夹信息
* */
export const updateDirectory = async (ctx, next) => {
    const {body} = ctx.request;
    const {result, noneKeys} = checkRequired(body, ['name', 'id']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const {name,id} = body ;
    const updateRes = await updateById(Directory,{_id:id},{name});
    if(updateRes.success){
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    }else{
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}

// 查询文件夹列表
export const queryDirectoryList = async (ctx, next) => {
    const {body} = ctx.request;
    const {pageNum = 1, pageSize = 20, type} = body;
    const {result, noneKeys} = checkRequired(body, ['type']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const total = await await Directory.countDocuments({type});
    const list = await Directory.find({type})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort('-createAt');
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, list, {
        total,
        pageSize,
        pageNum
    });
}
//删除文件夹及其内部文件
export const removeDirectory = async (ctx, next) => {
    const {body} = ctx.request;
    const {result, noneKeys} = checkRequired(body, ['id']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const {id} = body;
    const removeDir = await removeById(Directory, id);
    if (! removeDir.success) {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
        return;
    }
    const list = await Document.find({directoryId : new RegExp(id)});
    const ids = list.map(item => {
        return item._id;
    })
    const removeDocs = await removeMany(Document, {_id : ids});
    if (! removeDocs.success) {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
        return;
    }
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
}
