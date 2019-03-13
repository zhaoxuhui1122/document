/* * 用户信息
 * */

import mongoose from '../utils/mongoose'

const userSchema = new mongoose.Schema({
    name: String, // 用户名
    password: String, // 密码
    email: String, // 邮箱号
    avatar:String,// 头像
    status: { // 状态 0：正常 1:冻结
        type: Number,
        default: 0
    },
    type: String, // 用户类型
    ext1: {
        type: String,
        default: null
    },
    ext2: {
        type: String,
        default: null
    },
    ext3: {
        type: String,
        default: null
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("User", userSchema)
