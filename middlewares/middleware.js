var session = require('express-session');
const bcrypt = require('bcryptjs')
const user = require('../models/user')
const {SECRET_TOKEN_KEY}= require('../SECRET_KEYS')


const jwt= require('jsonwebtoken')

// A middleware to check the validity of the token recieved from the frontend in headers.

// The user ID and Token are stored in session storage ( Using security keys ) to to reduce the repetetive fetching of user details from databse in furthur queries.

async function check(req, res, next) {
	try{
		const token = req.header('authorization').replace('Bearer ','')
		
		const decoded =jwt.verify(token,SECRET_TOKEN_KEY)
		var done=0
		const tup= await user.findOne({_id: decoded._id})
		
		for(var i=0;i<tup.token.length;i++){
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
    	res.status(404).json({ message: 'You are not authorized to view this page' })
  	}
}
module.exports = check
