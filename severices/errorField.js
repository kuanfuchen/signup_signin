const  errorField = (resStatus, errMsg, next)=>{
  const error = new Error(errMsg);
  error.statusCode = resStatus;
  error.isOperational = true;
  next(error)
}
module.exports = errorField;