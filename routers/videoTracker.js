const express = require("express");
const videoTracker = require("../models/videoTracker");
const check = require("../middlewares/middleware");
const router = new express.Router();



router.post("/updateTime", check,async (req, res) => {


    console.log(req.body,req.session.user)
    var {video,time}=req.body
    try{
       
        var obj=await videoTracker.findOne({userID: req.session.user_id})
        
        for(var i = obj.tracker.length - 1; i >= 0; i--) {
            if(obj.tracker[i].videoID == video) {
                obj.tracker.splice(i, 1);
            }
        }

        if(obj.userID)
            obj.tracker.push({videoID:video,time:time})

        console.log(obj,"video22")
        await obj.save();

    }
    catch{
        var obj={
            "userID":req.session.user_id, 
            tracker:[]
        }
        obj.tracker.push({videoID:video,time:time})
        const itm = new videoTracker(obj);
        await itm.save();
    }

	// await tup.save();

	res.status(200).json({
		message: "Successfully Updated",
		// user: tup,
	});
});


router.post("/getTime", check,async (req, res) => {


    console.log(req.body,req.session.user)
    var {video}=req.body
       
        var obj=await videoTracker.findOne({userID: req.session.user_id})
        if(!obj) res.status(200).json({message: "First Time , no data"});

        for(var i = obj.tracker.length - 1; i >= 0; i--) {
            if(obj.tracker[i].videoID == video) {
                res.status(200).json({
                    message: "Success !",
                    data:obj.tracker[i]
                });
            }
        }
        res.status(200).json({message: "First Time , no data"});



});



module.exports = router;