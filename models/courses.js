const mongoose = require('mongoose')
const course=mongoose.model('course',{

	class:{
		type:String,
	},
	subject:{
		type:String,
	},
	topic:{
		type:String
	},
	subtopic:{
		type:String
	},
	description:{
		type:String,
	},
	file:{
		type:String
	}
})

module.exports =course