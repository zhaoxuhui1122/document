export default {
    port: 8000,// 服务监听的端口号
    mongodbUrl: 'mongodb://127.0.0.1/document',// mongodb数据库连接地址
    rootName: 'admin', //系统初始化时管理员账号
    rootPassword: '123456',// 系统初始化时管理员密码
    md5Key:'bc122aa96fe270b51e9bbed47758404b',// md5加密密码时的key值
}
