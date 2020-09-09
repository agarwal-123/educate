const mongoose = require('mongoose')
const user=mongoose.model('user',{
	userName:{
		type:String,
		required: true
	},
	password:{
		type:String,
		required: true
	},
	token:{
		type:Array
	},
	name:{
		type:String
	},
	
	//1 unpaid , 2 for paid
	level:{
		type:Number,
		// required: true,

	},
	phone:{
		type:String,
		// required: true
	},
	class:{
		type:Number
	},
	board:{
		type:String
	},
	profilePic:{
		type:String
	},
	gender:{
		type:String
	},
	city:{
		type:String
	},
	state:{
		type:String
	},
})

module.exports =user