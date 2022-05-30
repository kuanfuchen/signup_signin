const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    // name:{
    //     type:String,
    //     require:[true,'未寫入名稱']
    // },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    content:{
        type:String,
        required:[true,'content補充']
    },
    user:{
        ref:'user',
        type:mongoose.Schema.ObjectId,
        require:[true,'none user']
    },
    image:{
        type:String
    }
},{
    versionKey:false
})
const Post = mongoose.model('post', schema);
module.exports = Post;