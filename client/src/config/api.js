/*
* API
* */

export default {
    userCreate:'/user/register',// 用户注册
    userLogin: '/user/login',// 用户登录
    updateUser: '/user/update',// 更新用户
    findPassWord:'/user/findPassWord',// 找回密码
    userList:'/user/queryList',// 查询用户列表
    userUpdate:'/user/update',// 更新用户信息
    userDetail:'/user/queryDetail',// 用户详情
    queryDocumentList:'/document/queryList',// 获取文件夹下的文档列表
    createDocument:'/document/create',// 新增文档
    updateDocument:'/document/update',// 更新文档
    removeDocument:'/document/remove',// 删除文档
    queryDocumentDetail:'/document/detail',// 查询文档详情
    queryDirList:'/directory/queryList',// 获取文件夹列表
    createDir:'/directory/create',//新增文件夹
    removeDir:'/directory/removeById',// 删除文件夹
    updateDir:'/directory/update',// 更新文件夹
    queryProductList:'/product/queryList',// 查询产品文档或UI设计列表
    createProduct:'/product/create',// //新增产品文档或者UI设计稿
    updateProduct:'/product/update',// 更新产品
    queryProductDetail:'/product/queryDetail',// 查询产品详情
    removeProduct:'/product/removeById',// 删除产品文档
    uploadZip:'/product/upload',// 上传zip压缩包

};
