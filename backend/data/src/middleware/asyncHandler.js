module.exports = function asynHandler(fn) {
    return (req, res, next) => Promise.withResolvers(fn(req, res, next)).catch(next);
}