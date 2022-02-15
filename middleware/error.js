const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err};

    error.message = err.message;

    // Mongoose bad ObjectId
    if(err.name === 'CastError'){
        error = new ErrorResponse(`User with Id ${err.value} does not exist`,404);
    }

    // Mongoose Duplicate key error checking (will throw code: 11000)
    if(err.code === 11000){
        error = new ErrorResponse('Duplicate field value entered.', 400);
    }

    // Mongoose required field check
    if(err.name === 'ValidationError'){
        // loop over all the errors and grab the message value
        const message = Object.values(err.errors).map(val => val.message);

        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({ 
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;