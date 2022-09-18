const mongoose = require("mongoose");

const payMethod = new mongoose.Schema({
    name:String,
    cost:Number
});

module.exports= mongoose.model("payMethod",payMethod)