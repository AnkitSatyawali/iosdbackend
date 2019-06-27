const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const adminSchema = mongoose.Schema({
	username : {type:String , required:true,unique : true},
    password : {type: String,required:true},
    chapter : {type:String,required:true,unique:true}
});
adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model("admin",adminSchema);