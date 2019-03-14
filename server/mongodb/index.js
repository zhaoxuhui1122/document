/*
* 创建数据库连接
* */


import mongoose from '../utils/mongoose'
import config from '../config/config'
import logger from '../utils/logger'

export default ()=> {
     mongoose.connect(config.mongodbUrl,{useNewUrlParser: true},(err,db)=>{
        if(err){
           logger.error('数据库连接失败'+err)
            return
        }
        logger.info("数据库连接成功")
    })
}
