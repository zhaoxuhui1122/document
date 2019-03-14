/* *用户注册
 * */
import User from '../mongodb/user'
import {
    checkRequired,
    MD5,
    setResponseData,
    saveDate,
    hasData,
    findById,
    removeById,
    updateById
} from '../utils/utils'
import { SUCCESS_CODE, SUCCESS_MSG, ERROR_CODE, ERROR_MSG } from '../utils/constant'
import logger from '../utils/logger'
import config from '../config/config';
const { md5Key, rootName, rootPassword } = config ;

const reg = {
    email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
    phone: /^(1){1}(3|5|7|8){1}[0-9]{9}/,
    special: new RegExp('[`~!@#$^&%*¥()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]')
};

// 创建用户
export const createUser = async (ctx, next) => {
    const { body } = ctx.request;
    const { result, noneKeys } = checkRequired(body, ['name', 'email', 'password']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const { name, password, email, type } = body;
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    } else if (name.length < 2 || name.length > 20 || reg.special.test(name)) {
        ctx.body = setResponseData(ERROR_CODE, `用户名长度为2-20，不能含有特殊字符`);
        return;
    } else if (password.length < 6 || password.length > 20 || reg.special.test(password)) {
        ctx.body = setResponseData(ERROR_CODE, `密码长度为6-20，不能含有特殊字符`);
        return;
    } else if (!reg.email.test(email)) {
        ctx.body = setResponseData(ERROR_CODE, `邮箱格式有误`);
        return;
    }
    const hasSameName = await hasData(User, { name });
    if (hasSameName) {
        ctx.body = setResponseData(ERROR_CODE, `用户名已被注册`);
        return;
    }
    const hasSameEmail = await hasData(User, { email });
    if (hasSameEmail) {
        ctx.body = setResponseData(ERROR_CODE, `邮箱已被注册`);
        return;
    }
    const user = new User({ name, email, password: MD5(MD5(password) + md5Key), type });
    const save = await saveDate(user);
    if (save.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }

}
// 用户登录
/* *检测是否含有用户 */
export const findUser = limit => {
    return new Promise((resolve, reject) => {
        User.find(limit, (err, list) => {
            if (err) {
                reject()
            }
            resolve(list);
        })
    })
}

export const userLogin = async (ctx, next) => {
    const { body } = ctx.request;
    const { result, noneKeys } = checkRequired(body, ['name', 'password']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const { name, password } = body;
    const oldUser = await findUser({ name })


    if (oldUser.length > 0) {
        if (oldUser[0].password === MD5(MD5(password) + md5Key)) {
            const { _id, name, type, status } = oldUser[0];
            if (status === 1) {
                ctx.body = setResponseData(ERROR_CODE, '账户被冻结，请联系管理员！');
            } else {
                ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, {
                    id: _id,
                    name,
                    type,
                    status
                });
            }

        } else {
            ctx.body = setResponseData(ERROR_CODE, `用户名或密码错误`);
        }
    } else {
        ctx.body = setResponseData(ERROR_CODE, `用户不存在`);
    }
}
/* *
 *查询用户列表
 * */
export const queryUsertList = async (ctx, next) => {
    const { body: { pageNum = 1, pageSize = 20 } } = ctx.request;
    const total = await await User.count({});
    const list = await User.find({})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort('-createAt');
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, list, {
        total,
        pageSize,
        pageNum
    });
}
export const queryUsertDetail = async (ctx, next) => {
    const { body } = ctx.request;
    const { result, noneKeys } = checkRequired(body, ['id']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const { id } = body;
    const res = await findById(User, id);
    if (res.success) {
        const { data: { name, type, email } } = res;
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, { name, type, email });
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}
// 删除用户
export const removeUser = async (ctx, next) => {
    const { body: { id = '' } } = ctx.request;
    const res = await removeById(User, id);
    if (res.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}


// 更新用户信息
export const updateUser = async (ctx, next) => {
    const { body } = ctx.request;
    const { result, noneKeys } = checkRequired(body, ['id']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const find = await findById(User, body.id);
    if (!find.success) {
        ctx.body = setResponseData(ERROR_CODE, '用户不存在');
        return;
    }
    const { password } = body;
    const update = await updateById(User, { _id: body.id }, password ? {
        ...body,
        password:  MD5(MD5(password) + md5Key),
        updateAt: Date.now()
    } : {
        ...body,
        updateAt: Date.now()
    });

    if (update.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}

// 找回密码
function finaByName(name) {
    return new Promise(resolve => {
        User.findOne({ name }, (err, doc) => {
            if (err) {
                resolve({
                    success: false
                })
                return;
            }
            if (doc) {
                resolve({
                    success: true,
                    data: doc
                })
            } else {
                resolve({
                    success: false
                })
            }
        })
    })
}
// 找回密码
export const findPassWord = async (ctx, next) => {
    const { body } = ctx.request;
    const { result, noneKeys } = checkRequired(body, ['name']);
    if (!result) {
        ctx.body = setResponseData(ERROR_CODE, `${noneKeys.join(',')}为必填字段`);
        return;
    }
    const { name, password } = body;
    const { success, data = {} } = await finaByName(name);
    if (!success) {
        ctx.body = setResponseData(ERROR_CODE, '用户不存在');
        return;
    }
    const { _id } = data;
    const update = await updateById(User, { _id }, {
        password:MD5(MD5(password) + md5Key),
        updateAt: Date.now()
    });
    if (update.success) {
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}
// 初始化用户
export const initRootUser = async (ctx, next) => {
    const hasSameName = await hasData(User, { name: rootName });
    if (hasSameName) {
        logger.info('已有同名用户,初始化用户成功');
        return;
    }
    const user = new User({ name: rootName, password: MD5(MD5(rootPassword) + md5Key), type: 'ADMIN' });
    const save = await saveDate(user);
    if (save.success) {
        logger.info('初始化用户成功');
    } else {
        logger.error('初始化用户失败');
    }
}

