/* *
 * document文件信息存储
 * */

import mongoose from '../utils/mongoose'
import {
    MD5
} from '../utils/utils'

const Document = new mongoose.Schema({
    id: {
        type: String,
        default: MD5(`${Date.now()}${12}`)
    },
    title: String,
    content: String,
    userId: String,
    directoryId:String,// 文件夹目录
    type: { // 1 笔记 | 2 markdown
        type: Number,
        default: 1
    },
    status: { // 0 正常 1 删除
        type: String,
        default: 0
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    },
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
    }
});

export default mongoose.model("Document", Document)
