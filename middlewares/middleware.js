var session = require('express-session');
const bcrypt = require('bcryptjs')
const user = require('../models/user')


const jwt= require('jsonwebtoken')



async function check(req, res, next) {
	try{
		if(req.session.user_id) console.log(req.session.user_id,"yeaaaaahh");
		const token = req.header('authorization').replace('Bearer ','')
		
		const decoded =jwt.verify(token,'aSecretKey')
		// console.log(token,decoded)
		var done=0
		const tup= await user.findOne({_id: decoded._id})
		
		for(var i=0;i<tup.token.length;i++){
			console.log(tup.token[i],"gotcha")
			if(tup.token[i]==token){
				req.session.user_id=tup._id
				req.session.user=tup
				done=1
				
				next()
			}
		}
		if(!done) res.status(404).json({ message: 'You are not authorized to view this page' })

	}
  	catch(e) {
    	// res.send('You are not authorized to view this page');
    	res.status(404).json({ message: 'You are not authorized to view this page' })
  	}
}
module.exports = check