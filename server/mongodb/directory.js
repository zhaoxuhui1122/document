/*
* 文件夹
* */

import mongoose from '../utils/mongoose'


const directorySchema = new mongoose.Schema({
    name:{ // 文件夹名称
        type:String,
        required:true
    },
    type:{ // 文件夹类型 1 产品文档 2 UI设计稿 3 公共文档
        type:Number,
        required:true
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
        type: Object,
        default: {}
    },
});


export default  mongoose.model("Directory", directorySchema);

