const mongoose = require('mongoose')

// const khcInventory= require('../models/khc')
mongoose.connect('mongodb+srv://imsHP:imsHP@cluster0-exoql.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser: true, 
	useCreateIndex: true})
