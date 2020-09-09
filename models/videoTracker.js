const mongoose = require('mongoose')
const videoTracker=mongoose.model('videoTracker',{
    userID:{
        type:'string'
    },
    tracker: [{
        videoID: {
            type: String
        },
        time:{
        	type:String
        }
    }]
})

module.exports =videoTracker