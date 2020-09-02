const mongoose = require('mongoose')
const chat=mongoose.model('chat',{

	userID:{
		type:String,
		// required: true
	},
	class:{
		type:String,
	},
	subject:{
		type:String,
		default:null,
	},

    chatList: [{
        chat: {
            type: String
        },
        isFile:{
        	type:Boolean
        }
    }]
})

module.exports =chat