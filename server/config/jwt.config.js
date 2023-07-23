const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_COOKIE;
module.exports.secret = secret;
module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.cookies.accountAccessToken, secret, (err, payload) => {
        if (err) {
            res.status(401).json({verified: false});
        } else {
            next();
        }
    });
}