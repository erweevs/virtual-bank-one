const advanceResults = (model, populate) => async (req, res, next) => {
    // copy the request query
    const requestQuery = {...req.query};

    // array of fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // remove the nessecary fields so that we dont send it to MongoDB
    removeFields.forEach(param => delete requestQuery[param]);

    let query = model.find(requestQuery);

    // filter the returned data if there is a select query present
    if(req.query.select){
        // format the select parameters to fit the format Mongo requires
        const selectFields = req.query.select.split(',').join(' ');

        // mount the select paramters to the query
        query = query.select(selectFields);
    }

    // sort the data id the sort parameter is present
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');

        query = query.sort(sortBy);
    } else{
        // default sort by updatedAt
        query = query.sort('-updatedAt');
    }

    // for pagination, get the page number and amout per page
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // default to 10 per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if(populate){
        query = query.populate(populate)
    }

    // execut the query
    const results = await query;

    const paginationResult = {};

    // add the pagination details to the response
    if(endIndex < total){
        paginationResult.next = {
            page: page + 1,
            limit: limit
        };
    }

    if(startIndex > 0){
        paginationResult.prev = {
            page: page - 1,
            limit: limit
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination: paginationResult,
        data: results
    };

    next();
}

module.exports = advanceResults;