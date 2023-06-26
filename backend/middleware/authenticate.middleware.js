const jwt = require("jsonwebtoken")
require("dotenv").config();


const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        let decoded = jwt.verify(token, process.env.key);
        if (decoded) {
            req.body.userID = decoded.userID;
            next()
        }
        else {
            res.send({ "message": "you are not authorized" });
        }
    }
    else {
        res.send({ "message": "you are not authorized" });
    }
}

module.exports = {
    authenticate
}


