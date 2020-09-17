const express = require("express");
const check = require("../middlewares/middleware");
const router = new express.Router();

const question = require('../models/question');
const userattempt = require('./userAttempt')

router.post('/addattempt',async(req,res)=>{
      console.log(req.body.user,req.body.attempt);
      var tup=await userattempt.findOneAndUpdate({user: req.body.user},{$push:{attempt: req.body.attempt}},{upsert:true})
      res.send(tup);
})

router.post('/addquestion',async(req,res)=>{
      console.log(req.body);
      var itm=new question(req.body);
      await itm.save();
      res.send(itm);
})

router.post('/getquestion',async(req,res)=>{
      const user = req.body.user;
      const grade = req.body.grade;
      const sub= req.body.sub;

      
      const tup1 = await question.find({grade:grade,sub:sub});
      const tup2 = await userattempt.find({user:user});
      console.log(tup1,tup2);
      
      var attemptedIds=[];


      if(tup2.length!=0){
            attemptedIds=tup2[0].attempt.filter((obj)=>{
                  return obj.sub===sub;
            });
      }
      console.log(attemptedIds);

      var result=[];

      for(var i=0;i<tup1.length;i++){
            var exist=0;
            for(var j=0;j<attemptedIds.length;j++){
                  console.log(attemptedIds[j]._id,tup1[i]._id);
                  if(attemptedIds[j]._id==tup1[i]._id){
                        exist=1;
                        break;
                  }
            }
            console.log(exist);
            if(!exist){
                  result.push(tup1[i]);
            }
            if(result.length==20)
                  break;
      }
      res.send(result);
})

router.post('/getsubjectaccuracy',async(req,res)=>{
      const user=req.body.user;
      const sub=req.body.sub;
      const tup = await userattempt.find({user:user});

      if(tup.length==0){
            var result={
                  accuracy:0
            }
            res.send(result);
      }
      var tot=0,correct=0;
      console.log(tup[0].attempt);

      for(var i=0;i<tup[0].attempt.length;i++){
            if(tup[0].attempt[i].sub==sub){
                  tot++;
                  if(tup[0].attempt[i].ac==true)
                        correct++;

            }
      }
      console.log(correct,tot);
      
      var accuracy;
      if(tot==0)
      accuracy=0;
      else
      accuracy=correct/tot;
      
      var result={
            accuracy:accuracy
      }
      res.send(result);
})

router.post('/getchapteraccuracy',async(req,res)=>{
      const user=req.body.user;
      const sub=req.body.sub;
      const chapter=req.body.chapter;

      const tup = await userattempt.find({user:user});
      
      if(tup.length==0){
            var result={
                  accuracy:0
            }
            res.send(result);
      }
      var tot=0,correct=0;
      console.log(tup[0].attempt,sub,chapter);


      for(var i=0;i<tup[0].attempt.length;i++){
            if(tup[0].attempt[i].sub==sub && tup[0].attempt[i].chapter==chapter){
                  tot++;
                  if(tup[0].attempt[i].ac==true)
                        correct++;

            }
      }
      var accuracy;
      
      if(tot==0)
      accuracy=0;
      else
      accuracy=correct/tot;
      
      var result={
            accuracy:accuracy
      }
      res.send(result);
})

router.post('/getsubjectpractice',async(req,res)=>{
      
      const grade=req.body.grade;
      const user=req.body.user;
      const sub=req.body.sub;

      console.log(req.body);

      const tup1 = await userattempt.find({user:user});
      const tup2 = await question.find({grade:grade,sub:sub});
      
      if(tup1.length==0 || tup2.length==0){
            var result={
                  practice:0
            }
            res.send(result);
      }
      var tot=0;
      var all=tup2.length;

      for(var i=0;i<tup1[0].attempt.length;i++){
            if(tup1[0].attempt[i].sub==sub){
                  tot++;
            }
      }
      
      var practice=tot/all;
      var result={
            practice:practice
      }
      res.send(result);
})

router.post('/getchapterpractice',async(req,res)=>{ 
      const grade=req.body.grade;
      const user=req.body.user;
      const sub=req.body.sub;
      const chapter=req.body.chapter;

      const tup1 = await userattempt.find({user:user});
      const tup2 = await question.find({grade:grade,sub:sub,chapter:chapter});
      
      if(tup1.length==0 || tup2.length==0){
            var result={
                  practice:0
            }
            res.send(result);
      }

      var tot=0;
      var all=tup2.length;

      for(var i=0;i<tup1[0].attempt.length;i++){
            if(tup1[0].attempt[i].sub==sub && tup1[0].attempt[i].chapter==chapter){
                  tot++;
            }
      }

      var practice=tot/all;
      var result={
            practice:practice
      }
      res.send(result);
})

//getSubjectLearn    GetChapterLearn  
// video counter for user

module.exports = router;