const advancedResults = (model, populate) => async (req, res, next) => {
	let query;

	// COPY REQ . QUERY
	let reqQuery = { ...req.query };

	// exclude fields
	const removeFields = ['select', 'sort', 'page', 'limit'];

	// loop over remove fields and exclude them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// create query
	let queryStr = JSON.stringify(reqQuery);

	// create query operators
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// finding Resource
	query = model.find(JSON.parse(queryStr));

	// select fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// build sort query
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();
	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	// EXECUTING QUERY
	const results = await query;

	// PAGINATION RESULT
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	};

	next();
};

module.exports = advancedResults;
