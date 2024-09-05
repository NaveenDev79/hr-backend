const ErrorHandler = (err, req, res, next) => { 
    
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    
    console.error(`Error: ${errMsg}, Status Code: ${errStatus}, Stack: ${err.stack}`);
    
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
    });

    next();
};

module.exports = ErrorHandler;
