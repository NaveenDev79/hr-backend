const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {

    try {
        const token = req.headers.token;
        if (!token) {
            const error = new Error('Access Denied.');
            error.statusCode = 401;
            next(error);
        }

        const verified =  jwt.verify(token,process.env.JWT_SECRET) ;
        req.user = verified;
        next();
    } catch (error) {
        next(error);
    }
}
async function verifyAdmin(req, res, next) {

    try {
        verifyToken(req,res,()=>{   
            
            if(req.user?.role != "Employee"){
                next();
            }else{
                const error = new Error("Not Authroized, user is not admin");
                error.statusCode=500;
                next(error);
            }
            
        }) 
    } catch (error) {
        next(error);
    }
}
module.exports = {verifyToken,verifyAdmin};