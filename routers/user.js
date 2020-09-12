const express = require("express")
const user = require("../models/user")
const check = require("../middlewares/middleware")
const router = new express.Router()
const {SECRET_TOKEN_KEY}= require('../SECRET_KEYS')


const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.post("/login", async (req, res) => {
	try {
		var post = req.body
		const phone = post.phone
		var tup = await user.findOne({ phone: phone }) // Find the user tupple
		req.session.user_id = tup._id
		
		// Hash the given password and compare it with the stored hashed password
		const ismatch = await bcrypt.compare(post.password, tup.password)

		//Token Generation and Sending
		const token = jwt.sign({ _id: tup._id.toString() }, SECRET_TOKEN_KEY)
		if (ismatch) {
			// If credentials are valid, store it.
			// Only three devices are allowed to login at a time, if 3 already logged in replace the new one with the oldest one. 
			if(tup.token.length>2) tup.token.shift()
			tup.token.push(token)
			
			await tup.save()
			res.status(200).json({ tup, token })
		} else {
			res.status(404).json({ message: "Bad user/pass" })
		}
	} 
	
	catch (err) {
		res.status(404).json({ message: "Bad user/pass" })
	}
})

router.get("/showUser", check, async (req, res) => {
	res.status(200).json({ user: req.session.user })
})

// Logout route, if the token is present in the database, deletes it from the users table and from session storage.

router.get("/logout",check, async (req, res) => {
	var tup= await user.findOne({_id: req.session.user_id}) //Find the user tupple
	delete req.session.user 
	delete req.session.user_id 
	const token = req.header('authorization').replace('Bearer ','')
	for(var i=0; i<tup.token.length; i++){
		if(tup.token[i]==token){
			tup.token.pop(i)
			await tup.save()
		}
	}
	res.status(200).json({ message: "Logout Success" })
})

// Register Users

router.post("/register", async (req, res) => {
	try {
		var post = req.body
		const phone = post.phone
		tupple = await user.findOne({ phone: phone })
		// If the phone number is present, then user exits, no registration. 
		if (tupple.password)
			res.status(404).json({ message: "User Exists" })
	} 
	
	catch (err) {
		// Hashing the password and then storing it to database.
		req.body.password = await bcrypt.hash(req.body.password, 8)
		var itm = new user(req.body)
		
		//Generating a new token and storing it to token array
		const token = jwt.sign({ _id: itm._id.toString() }, SECRET_TOKEN_KEY)

		itm.token.push(token)
		await itm.save()
		res.status(200).json({
			message: "Successfully registered",
			user: itm,
			token: token,
		})
	}
})

// Edit details of user

router.post("/editUser", check,async (req, res) => {

	var user_tupple = await user.findOne({ phone: req.session.user.phone })
	user_tupple.name= req.body.name
	user_tupple.class= req.body.class
	user_tupple.gender= req.body.gender
	user_tupple.board= req.body.board
	user_tupple.city= req.body.city
	user_tupple.state= req.body.state
	// Save the updated details
	await user_tupple.save()

	res.status(200).json({
		message: "Successfully Updated",
		user: user_tupple,
	})
})


module.exports = router
