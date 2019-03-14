/*
* 产品需求文档和UI设计
* */

import mongoose from '../utils/mongoose'


const productSchema = new mongoose.Schema({
    name : { // 文件夹名称
        type : String,
        required : true
    },
    type : { // 文件夹类型 1 产品文档 2 UI设计稿
        type : Number,
        required : true
    },
    userId:{// 创建者id
        type:String,
        required:true
    },
    introduce : String,// 简介
    remark : String,// 备注
    indexUrl : String,// 入口文件地址
    zipUrl : String,// 原始文件地址
    files:Object,// 文件夹下所有文件
    directory:String,// 所在文件夹
    htmlList:Array,// 压缩包内所有的html路径
    createAt : {
        type : Date,
        default : Date.now()
    },
    updateAt : {
        type : Date,
        default : Date.now()
    },
    ext1 : {
        type : String,
        default : null
    },
    ext2 : {
        type : String,
        default : null
    },
    ext3 : {
        type : Object,
        default : {}
    },
});


export default mongoose.model('Product', productSchema);

