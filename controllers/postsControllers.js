const Post = require('../models/postsModel');
const User = require('../models/usersModel');
const handleSuccess = require('../severices/handleSuccess');
const handleErrorAsync = require('../severices/handleErrorAsync');
const errorField = require('../severices/errorField');

const postsContrllers = {
  getPosts: async(req, res)=>{
		const searchContent = req.query.search !==undefined && req.query.search !== null? {'content':new RegExp(req.query.search)} :{};
    const timeStamp = req.query.timeStamp==='asc'?'createAt':'-createdAt';
    const data = await Post.find(searchContent).populate({
			path:'user',
      select:'name photo'
    }).sort(timeStamp);
    handleSuccess(res, data)
  },
	createPost: handleErrorAsync(async(req, res, next)=>{
		const userId = req.user.id;
		await User.findById(userId).exec(()=> console.log);
		if(userId && req.body.content){
			const data = {
				'user':userId,
				'content':req.body.content,
				'image':req.body.image
			}
			const info = await Post.create(data);
			handleSuccess(res,info);
		}else{
			errorField(401, '缺少user || content 資訊', next)
		};
	}),
	deleteOnePosts: handleErrorAsync(async(req, res, next)=>{
		const id = req.params.id;
		const deleteMessage = await Post.findByIdAndDelete(id);
		if(deleteMessage !== null){
			handleSuccess(res,'刪除成功')
		}else{
			errorField(402, '貼文重複刪除', next)
		}
	}),
	deleteManyPosts: handleErrorAsync(async(req, res, next)=>{
			if(req.originalUrl==='/posts'){
				await Post.deleteMany({});
				handleSuccess(res,[]);
			}else{
				errorField(402,'刪除資料請補上id', next)
			}
	}),
	updataPosts: handleErrorAsync(async(req,res,next)=>{
		const id = req.params.id;
		const info = req.body;
		const userId = req.user.id;
		await User.findById(id).exec(()=> console.log);
		if( id && info.content){
			const data = await Post.findByIdAndUpdate(id,{
				'user':userId,
				'content':info.content,
				'image':info.image
			},{new:true, runValidators: true})
			if(data === null){
				return errorField(400, '資料為空', next)
			}
			handleSuccess(res, data)
		}else{
			errorField(403, '變更缺少必要資訊(id || user || content)', next)
		}
	})
}
module.exports = postsContrllers