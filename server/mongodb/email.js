/*
* 邮件记录
* */

import mongoose from '../utils/mongoose'


const emailSchema = new mongoose.Schema({
    from: String,
    to: String,
    subject : String ,
    html: String,
    createAt: {
        type: Date,
        default: Date.now()
    }
});


export default  mongoose.model("eMail", emailSchema);

