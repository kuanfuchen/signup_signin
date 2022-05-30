const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, '請輸入名字']
    },
    email:{
        type:String,
        select:false,
        required:[true,'請輸入email']
    },
    photo:{
        type:String,
    },
    sex:{
        type:String,
        enum:['Male', 'Female'],
        require:[true, '請填入你的性別']
    },
    passward:{
        type:String,
        select:false,
        minlength:8,
        require:[true,'請輸入正確密碼']
    },
    createdAt:{
        type:Date,
        default:Date.now,
        select:false
    }
},{
    versionKey:0
})
const User = mongoose.model('user',schema);
module.exports = User;
