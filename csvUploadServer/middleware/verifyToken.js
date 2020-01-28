var jwt = require('jsonwebtoken');

 verifyToken  = (req, res, next) => {
    var decodedToken = '';
    console.log(req);
    let token = req.headers.authorization;
    console.log(token,"token");
    jwt.verify(token, 'secret', function(err, tokendata) {

        if (err) {
            return res.status(400).json({ message: ' Unauthorized request' });
        }
        if (tokendata) {
            decodedToken = tokendata;
            next();
        }
    })
}

module.exports = { verifyToken }