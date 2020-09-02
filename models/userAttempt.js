const mongoose = require('mongoose')
const userattempt=mongoose.model('userattempt',{
	user:{
		type:String,
	},
	attempt:{
		type:[],
	}
})

module.exports = userattempt
