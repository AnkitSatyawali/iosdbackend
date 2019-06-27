const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	username: {type:String , required:true,unique : true},
    phone: {type: Number,required:true},
    email: {type:String,required:true},
    college: {type:String,required:true},
    year: {type:String,required:true},
    filename :{type:String,required:true}
});

module.exports = mongoose.model("user",userSchema);