const express = require('express')
const user = require('../models/user')
const answerSheet = require('../models/answerSheets')
const test = require('../models/test')

const check = require('../middlewares/middleware')
const router = new express.Router()

// ##### File Upload ######


router.post('/uploadDP',check, function(req, res) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let sampleFile = req.files.sampleFile;
	var ext = sampleFile.name.substr(sampleFile.name.lastIndexOf('.') + 1);

	// Use the mv() method to place the file somewhere on your server
	var newName=Date.now()+'.'+ext;
	sampleFile.mv('./public/uploads/'+newName,async function(err) {
		if (err)
		  return res.status(500).send(err);
		  await user.findOneAndUpdate({_id: req.session.user_id},{$set:{profilePic:newName}})

		res.send({message:'File uploaded!',name: newName});
	});
});




router.post('/uploadAnswer',check, function(req, res) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let sampleFile = req.files.sampleFile;
	var ext = sampleFile.name.substr(sampleFile.name.lastIndexOf('.') + 1);

	// Use the mv() method to place the file somewhere on your server
	var newName=Date.now()+'.'+ext;
	sampleFile.mv('./public/uploads/'+newName,async function(err) {
		if (err)
		  return res.status(500).send(err);
		const itm=new answerSheet({
			userID:req.session.user_id,
			testID:req.body.testID,
			file:newName
		})
		await itm.save()
		res.send({message:'AnswerSheet uploaded!',name: newName,itm});
	});
});




router.post('/uploadTest',check,async function(req, res) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	let testFile = req.files.testFile;
	var ext = testFile.name.substr(testFile.name.lastIndexOf('.') + 1);

	var newName=Date.now()+'.'+ext;
	await testFile.mv('./public/uploads/'+newName);

	let ansFile = req.files.ansFile;
	var ext2 = ansFile.name.substr(ansFile.name.lastIndexOf('.') + 1);
	var newName2=Date.now()+'.'+ext2;
	await ansFile.mv('./public/uploads/'+newName2);

	const itm=new test({
		subject:req.body.subject,
		class:req.body.class,
		description:req.body.description,
		file:newName,
		answerFile:newName2
	})
	await itm.save()
	res.send({message:'AnswerSheet uploaded!',name: newName,itm});

});



module.exports = router;