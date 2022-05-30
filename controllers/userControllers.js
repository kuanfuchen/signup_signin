const User = require('../models/usersModel');
const handleSuccess = require('../severices/handleSuccess');
const handleErrorAsync = require('../severices/handleErrorAsync');
const errorField = require('../severices/errorField');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../severices/auth');

const usersContrllers = {
	userSignUp: handleErrorAsync(async(req, res, next)=>{
		let {email, passward, confirmPassward, name,sex, photo  } = req.body;
		const errMessage = [];
		if(!email || !passward || !confirmPassward || !name) errMessage.push('欄位未填寫');
		if(passward !==confirmPassward) errMessage.push('密碼不一致');
		if(!validator.isLength(passward,{min:8})) errMessage.push('密碼小於8碼');
		if(!validator.isEmail(email)) errMessage.push('Email 格式錯誤');
		if(sex === "" || sex === undefined || sex !== 'Male' && sex !== 'Female') errMessage.push('性別格式有誤');
		if(errMessage.length > 0) return next(errorField(400,errMessage,next));
		const repeatEmail = await User.findOne({email});
		if(repeatEmail !== null) return errorField(400,'email已註冊過',next);
		passward = await bcryptjs.hash(req.body.passward, 12);
		const newUser = await User.create({
			name,
			passward,
			email,
			sex,
			photo
		})
		generateJWT(newUser, 201, res);
	}),
	userSignIn: handleErrorAsync(async(req, res, next)=>{
		let { email, passward} = req.body;
		const errMessage = [];
		if( !email || !passward) errMessage.push('帳號密碼有空，請檢查');
		if( !validator.isEmail(email)) errMessage.push('Email 格式錯誤');
		if(!validator.isLength(passward,{min:8})) errMessage.push('密碼小於8碼');
		if(errMessage.length > 0)return errorField(400,errMessage,next);
		const user = await User.findOne({ email }).select('+passward');
		if(user === null)return errorField(401, '請確認此帳號是否有誤', next);
		const auth = await bcryptjs.compare(passward, user.passward);
		if(!auth){
			return errorField(401, '你的密碼不正確',next);
		};
		generateJWT(user, 200, res);
	}),
	userProfile:handleErrorAsync(async(req, res, next)=>{
		req.user.passward = undefined;
		const data = req.user;
		handleSuccess(res, data)
	}),
	userUpdatePassward: handleErrorAsync(async(req, res, next)=>{
		const {passward, confirmPassward} = req.body;
		const errMessage = [];
		if(!validator.isLength(passward,{min:8})) errMessage.push('密碼小於8碼');
		if(passward !== confirmPassward) errMessage.push('密碼不一致');
		if(errMessage.length >0 )return errorField(401, errMessage, next);
		const newPassward = await bcryptjs.hash(passward, 12);
		const updateUser= await User.findByIdAndUpdate(req.user.id, {passward: newPassward});
		generateJWT(updateUser, 202, res)
	}),
	userPatchUpdatePersonalInfo: handleErrorAsync(async(req, res ,next)=>{
		let { name, photo, sex  } = req.body;
		const errMessage = [];
		if(!name) errMessage.push('必須要有名稱');
		
		if(sex === undefined || sex === "" || sex !== 'Male' && sex !== 'Female') errMessage.push('性別格式有誤');
		
		if(errMessage.length>0) return errorField(401, errMessage, next);
		const updateInfo = {
			sex,
			photo,
			name,
		};
		const personalInfo = await User.findByIdAndUpdate(req.user.id, updateInfo, {new:true, runValidators: true});
		handleSuccess(res, personalInfo, 200)
	})
};
module.exports = usersContrllers