const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsControllers');
const  {isAuth} = require('../severices/auth');

/* GET users listing. */
router.get('/',isAuth, (req, res) =>{
  postsController.getPosts(req,res)
});
router.post('/', isAuth,(req, res, next)=>{
  postsController.createPost(req, res, next)
})
router.delete('/:id', isAuth,(req,res,next)=>{
  postsController.deleteOnePosts(req,res,next)
});
router.delete('/',isAuth,(req, res,next)=>{
  postsController.deleteManyPosts(req,res,next)
})
router.patch('/:id', isAuth,(req, res, next)=>{
  postsController.updataPosts(req,res,next)
})
module.exports = router;
