const getPageData = (req) => {
    const orderBy = req.query.orderBy ? req.query.orderBy.split(',')[0] : 'id';
    const asc = req.query.orderBy && req.query.orderBy.split(',').length > 1 ? req.query.orderBy.split(',')[1] : 'asc';
    const limit = req.query.limit ? req.query.limit : '20';
    const offset = req.query.offset ? req.query.offset : '0';

    return {
        orderBy: orderBy + ' ' + asc,
        limit: limit,
        offset: offset
    };
}

module.exports = { getPageData };