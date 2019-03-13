/*
*文件管理
*/
import mongoose from '../utils/mongoose'

const fileSchema = new mongoose.Schema({
    type :String , // 文件类型
    filename :String , // 文件名称
    originName:String, // 原始文件名字
    size:Number , // 文件大小
    path :String , // 文件在ali OSS 存储路径
    createAt: { // 上传时间
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
})


export default mongoose.model("File", fileSchema)
