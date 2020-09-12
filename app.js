var express = require("express")
var cors= require("cors")
require('./db/mongoose')
// import {SECRET_SESSION_KEY} from './SECRET_KEYS'
const {SECRET_SESSION_KEY}= require('./SECRET_KEYS')

const app=express()
const port=process.env.PORT || 3000

// To enable cors
app.use(cors())


app.use(express.json())

var session=require('express-session')
app.use(session({secret: SECRET_SESSION_KEY}));


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

const videoTracker= require('./routers/videoTracker');
app.use(videoTracker)

app.listen(port,function(){
  console.log("Started on PORT 3000");
})
