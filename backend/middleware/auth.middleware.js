module.exports = (req, res, next) => {
    // Middleware logic here
    console.log('Auth Middleware');
    next();
};
