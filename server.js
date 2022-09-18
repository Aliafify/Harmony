const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const {main } = require("./mongoose.js");
const Routes =require( "./Routes.js");
var passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const session  = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose =require("mongoose")
const app = express();
// -----------End Of Imports 

// --------------connect to mongoDB--------------
mongoose.set('useCreateIndex', true); //for warning 
main().catch((err)=>console.log(err));
   
  //-----------------Middleware------------------
  app.use(cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret:"cat",
    resave:true, 
    saveUninitialized:true
  }));
  app.use(cookieParser("secretcode"));
  app.use(passport.initialize());
  app.use(passport.session());
  require("./passportConfig")(passport);
    

  //-----------------End of Middleware------------
  app.use("/",Routes);
const PORT = process.env.PORT||8080;
// runing server  
app.listen(PORT,()=>{
    console.log("server is runing on port" + PORT)
})






 
 