const express = require('express')
const user = require('../models/user')
const answerSheet = require('../models/answerSheets')
const test = require('../models/test')

const check = require('../middlewares/middleware')
const router = new express.Router()

// ##### File Upload ######

// Uploading the profile pic of user.
router.post('/uploadDP',check, function(req, res) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let sampleFile = req.files.sampleFile;
	var ext = sampleFile.name.substr(sampleFile.name.lastIndexOf('.') + 1);

	// Use the mv() method to place the file somewhere on your server locally
	var newName=Date.now()+'.'+ext;
	sampleFile.mv('./public/uploads/'+newName,async function(err) {
		if (err)
		  return res.status(500).send(err);
		  await user.findOneAndUpdate({_id: req.session.user_id},{$set:{profilePic:newName}})

		res.send({message:'File uploaded!',name: newName});
	});
});




module.exports = router;