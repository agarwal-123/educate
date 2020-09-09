var express = require("express")
var cors= require("cors")
require('./db/mongoose')

const user=require('./models/user')
const answerSheets=require('./models/answerSheets')
const test=require('./models/test')

const app=express()
const port=process.env.PORT || 3000

//cors
app.use(cors())


app.use(express.json())

// var bodyParser = require("body-parser");
var session=require('express-session')
app.use(session({secret: "Shh, its a secret!"}));


const userRouter = require('./routers/user')
app.use(userRouter)

const smsRouter = require('./routers/smsVerification')
app.use(smsRouter)


const uploadRouter = require('./routers/filesUpload')
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(uploadRouter)


app.use(express.static(__dirname + '/public'));

const coursesRouter = require('./routers/courses')
app.use(coursesRouter)

const chat = require('./routers/chat')
app.use(chat)

const userAttempt= require('./routers/userAttempt');
app.use(userAttempt)

const videoTracker= require('./routers/videoTracker');
app.use(videoTracker)

app.listen(port,function(){
  console.log("Started on PORT 3000");
})