const mongoose = require("mongoose");

const worker = new mongoose.Schema({
    
    name:{type:String},
    email:{type:String,required:true},
    username:{type:String,unique:true },
    password:{type:String ,required:true },
    date:{type:Date, default:Date.now},
    identification:Number,
    address:String,
    phone:[],
    job:String,
    sallary:String,
    role:{type:String,default:"worker"}   
});
module.exports= mongoose.model("Worker",worker)
 