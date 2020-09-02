const mongoose = require('mongoose')
const answerSheets=mongoose.model('answerSheets',{

	userID:{
		type:String,
		// required: true
	},
	testID:{
		type:String,
	},
	status:{
		type:String,
		default:null,
	},
	file:{
		type:String
	}
})

module.exports =answerSheets