const mongoose = require('mongoose')
const question=mongoose.model('question',{
	grade:{
		type:String,
	},
	sub:{
		type:String,
      },
      chapter:{
		type:String,
	},
	question:{
		type:String,
      },
	op1:{
		type:String,
	},
	op2:{
		type:String,
      },
      op3:{
		type:String,
      },
      op4:{
		type:String,
      },
      ans:{
		type:String,
      },
      note:{
		type:String,
      }
})
module.exports = question