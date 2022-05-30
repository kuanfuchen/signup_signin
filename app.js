const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
require('./connection')
const app = express();
process.on('uncaughtException',err => {
  console.error('Uncaught Exception');
  console.error(err);
  process.exit(1)
});
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRouter);
app.use('/posts', postsRouter);
app.use((req,res)=>{
  res.status(404).json({
    status: 'error',
    message:'無此路徑'
  })
})
const responseErrorDev = (err, res)=>{
  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
    stack: err.stack
  })
} 
const responseErrorProduction = (err,res)=>{
  if(res.isOperational ===true ){
      res.status(err.statusCode).json({message: err.message})
  }else{
    console.error('重大錯誤',err);
    res.status(500).json({
      message:err.message,
      status:'error'
    })
  }
}
app.use((err,req,res,next)=>{
  err.statusCode = err.status || 500;
  if(process.env.NODE_ENV === 'dev')return responseErrorDev(err,res);
  if(err.name === 'ValidationError'){
    err.message = '必要欄位未填寫，請重新送出';
    err.isOperational = true;
    return responseErrorProduction(err, res)
  }
  responseErrorProduction(err, res);
})
process.on('unhandledRejection',(err, promise)=>{
  console.error('rejection:',promise,'error:',err)
})
module.exports = app;
