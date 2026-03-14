




const errorHandler = (err, req,res,next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

   // mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors).map((el) => el.message);
        message = `Validation error: ${errors.join(", ")}`;
    }

    // mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value entered`;
    }

    // jwt
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    // jwt expired
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    console.error("Error:", err);
    res.status(statusCode).json({
        success: false,
        error: message
    });     

        
}  

export default errorHandler;