const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };

	error.message = err.message;

	// log to console for the developer
	console.log(err);

	// MONGO BAD OBJECT ERRROR

	if (err.name === 'CastError') {
		const message = `Resource not found with id ${err.value}`;
		error = new ErrorResponse(message, 404);
	}

	// MONGOOSE DUPLICATE ERROR
	if (err.code === 11000) {
		const message = 'Duplicate field value entered';
		error = new ErrorResponse(message, 400);
	}

	// MONGOOSE VALIDATIONERROR

	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((value) => value.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		Error: error.message || 'Server error',
	});
};

module.exports = errorHandler;
