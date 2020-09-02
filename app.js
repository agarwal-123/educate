var express = require("express")
require('./db/mongoose')

const user=require('./models/user')

const app=express()
const port=process.env.PORT || 3000
app.use(express.json())

// var bodyParser = require("body-parser");


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// var path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

//##################### Level/Login part ############

var session = require('express-session');

app.use(session({secret: "Shh, its a secret!"}));



//2) The login route:

app.post('/login', async (req, res)=> {
  var post = req.body;
  const user_nam = post.userName
  var tup=0
  try{

	  tup = await user.findOne({userName: user_nam}) 

	  console.log(tup.password, post.password,user_nam)
	  // if(!tup) res.send('Bad user/pass')
	  if(tup.password === post.password){

	    req.session.user_id = tup.userName
	    req.session.level=Number(tup.level)
	    // req.session.thanaNumber=3//Number(tup.thanaNumber)

	    console.log(req.session.level)
	    // res.send('Correct Password ')
	    res.status(200).json({ message: 'Correct Password' ,tup})
	  } else {
	    res.status(404).json({ message: 'Bad user/pass' })
	  }
}

catch (err) {res.status(404).json({ message: 'Bad user/pass' }) }

});


//console.log(req.session.user_id)

// logout route:

app.get('/logout', async (req, res) =>{
  delete req.session.user_id;
  res.status(200);
}); 


// Register Users

app.post('/register',async (req, res)=>{
	try{
		var post = req.body;
  		const user_nam = post.userName
		tup = await user.findOne({userName: user_nam})
		if(tup.password) 
			res.status(404).json({ message: 'User Exists' })
	}
	catch(err){
		const itm=new user(req.body)
		await itm.save()
		// res.status(200)
		res.status(200).json({ message: 'Successfully registered'})
	}
})




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
	// random_otp=int(random_otp)
	console.log("edeeeeededededededededede")
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
		).then(message => console.log(message.sid,random_otp));
	})
}


app.post('/sendSMS',async (req, res)=>{

	var to = req.body.to;
	var random_otp=("" + Math.random()).substring(2, 8);
	req.session.otp=random_otp;
	console.log("yeee",req.session.otp)
	sendSMS(to,random_otp).then(res.json({ message:'OTP Sent'}))

})


app.post('/otpVerify',async (req, res)=>{

	var userCode = req.body.userCode;
	if(userCode==req.session.otp) res.status(200).json({ message: 'OTP Verified'})
		
	else res.status(404).json({ message: 'Wrong OTP'})


})



app.listen(port,function(){
  console.log("Started on PORT 3000");
})