const express = require('express')
// const user = require('../models/user')
const answerSheet = require('../models/answerSheets')
const chat = require('../models/chat')

const check = require('../middlewares/middleware')
const router = new express.Router()


router.post('/addChat',check,async (req, res)=>{
	console.log(req.body)
	req.body.userID=req.session.user_id
	var newChat=req.body.chat
	var isFile=	 Boolean(req.files);

	if (isFile) {
		let testFile = req.files.testFile;
		var ext = testFile.name.substr(testFile.name.lastIndexOf('.') + 1);

		var newName=Date.now()+'.'+ext;
		await testFile.mv('./public/uploads/'+newName);
		newChat=newName;
	}

	var tup=await chat.findOneAndUpdate({userID: req.session.user_id, subject:req.body.subject},{$push:{chatList:{chat:newChat ,isFile:isFile } }},{upsert:true})

  	res.send({tup});
    
})


router.get('/chats/:subject',check,async (req, res)=>{
	// console.log(req.params)
	// req.body.userID=req.session.user_id
	var tup=await chat.findOne({userID: req.session.user_id, subject:req.params.subject})

  	res.send({tup});
    
})

module.exports = router;