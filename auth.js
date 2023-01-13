const jwt = require('jsonwebtoken');
module.exports = async function (req, res, next) {
    try {
        const token = req.header.token;
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    res.send('invalid token');
                    // next(err);
                }else {
                    console.log('auth+++++++++++++++++++');
                    next();
                }
            });
        }else{
            return res.send('No Avtorizovan');
        }
    } catch (e) {
        console.log(e);
    }
}