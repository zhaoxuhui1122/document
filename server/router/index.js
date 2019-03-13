import KoaRouter from 'koa-router'
const router = new KoaRouter()
import fs from 'fs'
import path from 'path'
import multerConfig from '../config/multer'
// 用户相关
import {
    createUser,
    updateUser,
    findPassWord,
    removeUser,
    userLogin,
    queryUsertDetail,
    queryUsertList
} from '../service/user';

// 文档管理
import {
    createDocument,
    updateDocument,
    queryOneDocumentDetail,
    queryDocumentList,
    removeDocument
} from '../service/document';

// 文件夹操作

import {
    createDirectory,
    updateDirectory,
    queryDirectoryList,
    removeDirectory
} from '../service/directory';
// 后台文档项目
import {
    createProduct,
    updateProduct,
    queryProductList,
    queryProductDetail,
    removeProductById,
    uploadProductZip
} from '../service/product';


router.get('/', async (ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.readFileSync(resolve('/static/index.html'));
});


// 用户注册
router.post('/user/register', createUser);
// 用户列表
router.post('/user/queryList', queryUsertList);
//用户登录
router.post('/user/login', userLogin);
// 更新用户信息
router.post('/user/update', updateUser);
// 找回密码
router.post('/user/findPassWord', findPassWord);
//删除用户
router.post('/user/remove', removeUser);
// 查询用户详情
router.post('/user/queryDetail', queryUsertDetail);
// 存储 Document 文档
router.post('/document/create', createDocument);
// 更新 Document 文档
router.post('/document/update', updateDocument);
// 查看一个 Document 文档
router.post('/document/detail', queryOneDocumentDetail);
// 查询 Document 列表
router.post('/document/queryList', queryDocumentList);
// 删除 Document 文档
router.post('/document/remove', removeDocument);
// 创建文件夹
router.post('/directory/create', createDirectory);
//更新文件夹
router.post('/directory/update',updateDirectory);
// 查询文件夹列表
router.post('/directory/queryList', queryDirectoryList);
// 删除文件夹
router.post('/directory/removeById',removeDirectory);
// 创建项目
router.post('/product/create', createProduct);
// 更新项目
router.post('/product/update',updateProduct);
// 查询项目列表
router.post('/product/queryList', queryProductList);
// 查询产品详情
router.post('/product/queryDetail', queryProductDetail);
// 删除单个文档
router.post('/product/removeById', removeProductById);
// 上传单个文档
router.post('/product/upload', multerConfig.single('file'), uploadProductZip);


export default router
