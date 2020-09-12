const express = require("express");
const videoTracker = require("../models/videoTracker");
const check = require("../middlewares/middleware");
const router = new express.Router();

// A route to let the user start the video from where he/she ended viewing in past.

router.post("/updateTime", check, async (req, res) => {

    var {video,time}=req.body
    // If the video is watched previously, find the old entry , delete it and add the new one in user's array.
    try{ 
        var video_obj=await videoTracker.findOne({userID: req.session.user_id})
        
        for(var i = video_obj.tracker.length - 1; i >= 0; i--) {
            if(video_obj.tracker[i].videoID == video) {
                video_obj.tracker.splice(i, 1);
            }
        }

        if(video_obj.userID)
            video_obj.tracker.push({videoID:video,time:time})
        
        await video_obj.save();
    }
    // If the video is newly visited push the entry
    catch{
        var obj={
            "userID":req.session.user_id, 
            tracker:[]
        }
        obj.tracker.push({videoID:video,time:time})
        const itm = new videoTracker(obj);
        await itm.save();
    }

	res.status(200).json({
		message: "Successfully Updated",
	});
});


// Fetching the time till which user compeleted the video in past.
router.post("/getTime", check,async (req, res) => {

    var {video}=req.body
       
    var video_obj=await videoTracker.findOne({userID: req.session.user_id})
    if(!video_obj) res.status(200).json({message: "Video opened first time, no data available"});

    //Finding the given videoID in array.
    for(var i = video_obj.tracker.length - 1; i >= 0; i--) {
        if(video_obj.tracker[i].videoID == video) {
            res.status(200).json({
                message: "Success !",
                data:video_obj.tracker[i]
            });
        }
    }
    res.status(200).json({message: "Video opened first time, no data available"});

});

module.exports = router;