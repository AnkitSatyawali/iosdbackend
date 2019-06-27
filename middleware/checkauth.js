const jwt = require('jsonwebtoken');
const config = require('../config/database');
module.exports = (req,res,next) => {
	try {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token,config.JWT_KEY);
	req.userData = {username:decodedToken.username,adminId:decodedToken.adminId};
	next();
   } catch(error) {
   	 res.status(401).json({message:"Auth failed"});
   }
}