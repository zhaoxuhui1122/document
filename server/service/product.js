import Product from '../mongodb/product'
import {checkRequired, setResponseData, saveDate, hasData, findById, removeById, updateById} from '../utils/utils'
import {SUCCESS_CODE, SUCCESS_MSG, ERROR_CODE, ERROR_MSG} from '../utils/constant'
import fs from 'fs';
import fse from 'fs-extra'
import unzip from 'node-unzip-2';
import path from 'path';
import {getHtmlPath} from '../utils/utils'

function resolve(dir) {
    return path.join(__dirname, '../../', dir)
}

import {mkdir, rmdir, readdir, unzipFile} from '../utils/fs'
// 创建产品
export const createProduct = async (ctx, next) => {
    const {body} = ctx.request;
    const {result, noneKeys} = checkRequired(body, ['name', 'type', 'zipUrl', 'userId', 'indexUrl', 'tmpDirectory', 'htmlList']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const {name, type, zipUrl, introduce, userId, tmpDirectory, indexUrl, htmlList} = body;
    const hasName = await hasData(Product, {name});
    if (hasName) {
        ctx.body = setResponseData(ERROR_CODE, `已有相同名称的项目！`);
        return;
    }
    const src = tmpDirectory.replace(/^tmp/, 'static/product');
    await mkdir(src);
    const copyRes = await fse.copySync(tmpDirectory, src, {overwrite : true});
    const product = new Product({
        name,
        type,
        zipUrl : zipUrl.replace(/^tmp/, '/static/product'),
        indexUrl,
        introduce,
        userId,
        htmlList,
        directory : src
    });

    const save = await saveDate(product);
    await rmdir(tmpDirectory); // 删除缓存文件夹
    if (save.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, save.data);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}
//更新产品信息
export const updateProduct = async (ctx, next) => {
    const {body} = ctx.request;
    const {result, noneKeys} = checkRequired(body, ['id']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const { zipUrl, tmpDirectory} = body;
    const item = await findById(Product, body.id);
    if (tmpDirectory) { // 更改过zip压缩包
        const src = tmpDirectory.replace(/^tmp/, 'static/product');
        await mkdir(src);
        const copyRes = await fse.copySync(tmpDirectory, src, {overwrite : true});
        const {data : {directory}} = item;
        await rmdir(directory);
        await rmdir(tmpDirectory); // 删除缓存文件夹
    }
    const updateRes = await updateById(Product, {_id : body.id}, {
        ...body,
        zipUrl : zipUrl.replace(/^tmp/, '/static/product'),
        directory : tmpDirectory.replace(/^tmp/, 'static/product')
    });
    if (updateRes.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG, updateRes.data);
    }
}

// 查询产品列表
export const queryProductList = async (ctx, next) => {
    const {body} = ctx.request;
    const {pageNum = 1, pageSize = 20, type} = body;
    const {result, noneKeys} = checkRequired(body, ['type']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const total = await await Product.countDocuments({type});
    const list = await Product.find({type})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort('-createAt');
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, list, {
        total,
        pageSize,
        pageNum
    });
}
// 查询单个文档详情
export const queryProductDetail = async (ctx, next) => {
    const {body} = ctx.request;
    const {pageNum = 1, pageSize = 20, type} = body;
    const {result, noneKeys} = checkRequired(body, ['id']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const {id} = body;
    const res = await findById(Product, id);
    if (res.success) {
        const {data={}} = res ;
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG,data);
    } else {
        ctx.body = setResponseData(ERROR_CODE, '查询的数据不存在');
    }
}
// 删除项目
export const removeProductById = async (ctx, next) => {
    const {body} = ctx.request;
    const {pageNum = 1, pageSize = 20, type} = body;
    const {result, noneKeys} = checkRequired(body, ['id']);
    if (! result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const {id} = body;
    const find = await findById(Product, id);

    if (! find.success) {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
        return;
    }
    const {data : {directory}} = find;
    await rmdir(directory);
    const remove = await removeById(Product, id);
    if (remove.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}
// 上传zip文件
export const uploadProductZip = async (ctx, next) => {
    const {file} = ctx.req;
    const {path, originalname} = file;
    const src = `tmp/${new Date().getTime()}`
    await mkdir(src);
    const copyRes = await fse.copySync(path, `${src}/${originalname}`, {overwrite : true});
    const unzipRes = await unzipFile(`${src}/${originalname}`, src);
    const files = await readdir(src);
    fs.unlinkSync(path);
    if (! files.success) {
        ctx.body = setResponseData(ERROR_CODE, `文件解压缩失败！`);
        return;
    }
    const {data = []} = files;
    const htmlList = getHtmlPath(data);
    if (htmlList.length === 0) {
        ctx.body = setResponseData(ERROR_CODE, 'zip压缩包中不存在html文件');
        return;
    }
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, {
        zipUrl : `${src}/${originalname}`,
        htmlList,
        directory : src,
    })
}
