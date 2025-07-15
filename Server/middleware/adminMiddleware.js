const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== 'admin'){
            throw new Error();
        }
        next();
    }catch(err){
        res.status(403).json({message: "Forbidden: Only Admins can access this route"});
    }
};


module.exports = adminMiddleware;