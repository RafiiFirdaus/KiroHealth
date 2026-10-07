const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(200).send({ message: 'Authentication failed', success: false });
            } else {
                // --- ADD THIS CHECK (LINES 13-15) ---
                if (!req.body) {
                    req.body = {}; 
                }
                // ----------------------------------------------
                req.body.userId = decode.id;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Authentication failed', success: false });
    }
};