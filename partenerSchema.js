const mongoose = require("mongoose");

const partenerSchema = new mongoose.Schema({
    
    username:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,unique:true},
    password:String,
    date:{type:Date, default:Date.now},
    identification:Number,
    address:String,
    phone:{type:Array , required:true},
    code:{type:String,unique:true},
    finance:{type:Number, required:true}, // التمويل
    bank:Number,
    gainOut:Number,
    outdetails:[],
    goods:Number,
    gainDetails:[], //[{req:Number,exist:Number,clientID:Number,out:{value:[],reason:[],date:[]}}],
    gain:Number,  //الربح 
    clients: {type:Number ,default:0},// عدد العملاء\
    role:{type:String,default:"Partener"},
    first_partener:String  // الادارة التابع لها الشريك او المستثمر
});
module.exports= mongoose.model("Partener",partenerSchema)
 