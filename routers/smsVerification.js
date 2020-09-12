const express = require('express')
const user = require('../models/user')
const check = require('../middlewares/middleware')
const router = new express.Router()

//OTP verification Twilio

const twilio = require('twilio')

// Send SMS Messages directly using a Twilio Number
const sendSMS = (to,random_otp) => {
	// Initialise account credentials
	const TWILIO_ACCOUNT_SID = "AC05565f013560f8c7f6d05bb2d6639c8e"
	const TWILIO_AUTH_TOKEN = "4b3421cada5f30071ac34e7d5f49bdf0"
	const TWILIO_NUMBER = "+12067361033"

	// Create new twilio client

	const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
	var body="Your One Time Password for E-Learning is: "+random_otp
	return new Promise((success, fail) => {
	// Send the text message.
		client.messages.create(
		  {
		    to, // Recipient's number
		    from: TWILIO_NUMBER, // Twilio Number
		    body // Message to Recipient
		  },
		  (error, message) => {
		    if (error) {
		      fail(error)
		    } else {
		      success({ to, body })
		    }
		  }
		).then(message => console.log(message.sid,random_otp))
	})
}


router.post('/sendSMS',async (req, res)=>{

	var to = req.body.to
	// Generating a random number, storing it to database and sending it to user as otp
	var random_otp=("" + Math.random()).substring(2, 8)
	req.session.otp=random_otp
	sendSMS(to,random_otp).then(res.json({ message:'OTP Sent'}))

})


router.post('/otpVerify',async (req, res)=>{

	var userCode = req.body.userCode
	//###### Comment it on production!! #####
	if(userCode=='superUser') res.status(200).json({ message: 'OTP Verified'})

	if(userCode==req.session.otp) res.status(200).json({ message: 'OTP Verified'})
		
	else res.status(404).json({ message: 'Wrong OTP'})

})




module.exports = router