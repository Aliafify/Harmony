const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    
    name:{type:String},
    email:{type:String,required:true},
    username:{type:String,unique:true },
    password:{type:String ,required:true },
    date:{type:Date, default:Date.now},
    identification:Number,
    address:String,
    phone:String,
    finance:{type:Number},
    gainDetails:{type:Array,default:0},
    role:{type:String,default:"Admin"}   
});
module.exports= mongoose.model("Admin",adminSchema)
//export default mongoose.model("Partener",partenerSchema);
 