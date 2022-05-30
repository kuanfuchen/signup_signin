const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userControllers')
const  {isAuth} = require('../severices/auth');

router.get('/profile', isAuth,(req,res,next)=>{
  usersController.userProfile(req,res,next);
});
router.post('/sign_up',(req,res,next)=>{
  usersController.userSignUp(req,res,next);
});
router.post('/sign_in',(req,res,next)=>{
  usersController.userSignIn(req,res,next)
});
router.post('/updata_passward', isAuth,(req,res,next)=>{
  usersController.userUpdatePassward(req,res,next)
});
router.patch('/profile', isAuth, (req,res,next)=>{
  usersController.userPatchUpdatePersonalInfo(req, res, next);
})
module.exports = router;
