/*
 * find Product
 */
import Document from '../mongodb/document'
import {checkRequired, MD5, setResponseData, findById, saveDate, removeById, updateById} from '../utils/utils'
import { SUCCESS_CODE, SUCCESS_MSG, ERROR_CODE, ERROR_MSG, PAGE_SIZE } from '../utils/constant'
import logger from '../utils/utils'

// 创建一个文件
export const createDocument =  async (ctx, next) => {
    const {body} = ctx.request;
    const {result, noneKeys} = checkRequired(body, ['title', 'type', 'userId', 'status','directoryId']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const _markdown = new Document({
        ...body
    })
    const res = await saveDate(_markdown);
    if (res.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, res.data);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}
// 更新文档

export const updateDocument =  async (ctx, next) => {
    const { body } = ctx.request;
    const { result, noneKeys } = checkRequired(body, ['id']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const find = await findById(Document, body.id);
    if (!find.success) {
        ctx.body = setResponseData(ERROR_CODE, '数据不存在');
        return;
    }
    const { userId, id } = body;
    const update = await updateById(Document, {
        _id: id
    }, body);
    if (update.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}

// 查找一个文件
export const queryOneDocumentDetail = async (ctx, next) => {
    const { body } = ctx.request;
    const { id } = body;
    const { result, noneKeys } = checkRequired(body, ['id']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const res = await findById(Document, id);
    if (res.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, res.data);
    } else {
        ctx.body = setResponseData(ERROR_CODE, '查询的数据不存在');
    }
}

// 查询列表
export const queryDocumentList = async (ctx, next) => {
    const { result, noneKeys } = checkRequired(ctx.request.body, ['status']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const { body: { userId = '', keywords, pageSize = PAGE_SIZE, pageNum = 1, status = '1' ,directoryId} } = ctx.request;
    const regId = new RegExp(userId);
    const regTitle = new RegExp(keywords);
    const regStatus = new RegExp(status);
    const regDir = new RegExp(directoryId);

    const total = await await Document.countDocuments({ userId: regId, title: regTitle, status: regStatus,directoryId:regDir })
    const list = await Document.find({ userId: regId, title: regTitle, status: regStatus, directoryId:regDir})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort('-createAt');
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, list.map(item=>{
       const {_id,title,type,createAt,updateAt,userId,directoryId} = item ;
        return {
            _id,
            title,
            type,
            createAt,
            updateAt,
            userId,
            directoryId
        }
    }), {
        total,
        pageSize,
        pageNum
    });
}
// 删除文档
export const removeDocument =  async (ctx, next) => {
    const { body } = ctx.request;
    const { result, noneKeys } = checkRequired(body, ['id']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const find = await findById(Document, body.id);
    if (!find.success) {
        ctx.body = setResponseData(ERROR_CODE, '数据不存在');
        return;
    }
    const { id } = body;
    const remove = await removeById(Document, id);
    if (remove.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}
