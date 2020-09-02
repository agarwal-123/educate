const mongoose = require('mongoose')
const test=mongoose.model('test',{

	subject:{
		type:String,
	},
	class:{
		type:String,
	},
	description:{
		type:String,
	},
	file:{
		type:String
	},
	answerFile:{
		type:String
	},
	status:{
		type:String,
		default:"Active"
	}
})

module.exports =test