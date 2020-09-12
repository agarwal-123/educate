const express = require('express')
const chat = require('../models/chat')

const check = require('../middlewares/middleware')
const router = new express.Router()

// A route to store chats of two users, files can be uploaded too .
// Files temporarily stored locally, should be changed to aws s3 bucket in future.

router.post('/addChat',check,async (req, res)=>{
	console.log(req.body)
	req.body.userID=req.session.user_id
	var newChat=req.body.chat
	// isFile should be set true from frontend if a file is uploaded
	var isFile=	 Boolean(req.files)

	if (isFile) {
		let testFile = req.files.testFile
		// Extracting the file extension
		var ext = testFile.name.substr(testFile.name.lastIndexOf('.') + 1)

		// Generating a random name ( using Date.now() ).
		var newName=Date.now()+'.'+ext
		
		// Use the mv() method to place the file somewhere on your server locally
		await testFile.mv('./public/uploads/'+newName)
		newChat=newName
	}
	// updating the chat/file name to database
	var chats=await chat.findOneAndUpdate({userID: req.session.user_id, subject:req.body.subject},{$push:{chatList:{chat:newChat ,isFile:isFile } }},{upsert:true})

  	res.send({tup:chats})
    
})

// To get all chats of the user of the perticular subject
router.get('/chats/:subject',check,async (req, res)=>{
	var chats=await chat.findOne({userID: req.session.user_id, subject:req.params.subject})

  	res.send({tup:chats})
    
})

module.exports = router