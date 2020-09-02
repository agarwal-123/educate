const express = require('express')
const user = require('../models/user')
const answerSheet = require('../models/answerSheets')
const courses = require('../models/courses')

const check = require('../middlewares/middleware')
const router = new express.Router()


router.get('/getSubjects/:class/',async (req, res)=>{
	console.log(req.params)
	var tup = await courses.find({class: req.params.class}).distinct('subject');
	res.send(tup);
})


router.get('/getTopics/:class/:subject', async (req, res) =>{
	console.log(req.params)
	var tup = await courses.find({class: req.params.class, subject: req.params.subject}).distinct('topic');
	res.send(tup);
})


router.get('/getSubtopics/:class/:subject/:topic', async (req, res) => {
	console.log(req.params)
	var tup = await courses.find({class: req.params.class, subject: req.params.subject,topic: req.params.topic}).distinct('subtopic');
	res.send(tup);
})


router.get('/getVideos/:class/:subject/:topic/:subtopic',async (req, res)=>{
	console.log(req.params)
	var tup = await courses.find({subtopic: req.params.subtopic, topic: req.params.topic,subject: req.params.subject, class: req.params.class});
	res.send(tup);
})


router.post('/addVideo',async (req, res)=>{
	// console.log(req.params)
	const itm=new courses(req.body)
	await itm.save();
	res.send(itm);
})


module.exports = router;