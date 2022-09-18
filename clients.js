const mongoose = require("mongoose");

const client = new mongoose.Schema({
    name:{type:String},
    email:String,
    date:{type:Date, default:Date.now},
    identification:{type:Number, required:true,unique:true}, 
    address:String,
    phone:[],
    role:{type:String,default:"Client"},
    advance:{type:Array, required:true},// القرض
    excess :{type:Number,required:true }, // الفائدة
    payments:{date:[], values:[]},   // المدفوع من الاقساط
    state: {type:String, default:"منتظم"},      //حالة المقترض متاخر او منتظم او مغلق
});

module.exports= mongoose.model("Client",client)