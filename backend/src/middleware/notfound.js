function notFound( req, res, next) {
    res.status(404)
    next(new Error("Not found"))
}

module.exports = { notFound };