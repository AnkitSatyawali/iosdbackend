const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const superSchema = mongoose.Schema({
	username : {type:String , required:true,unique : true},
    password : {type: String,required:true}
});
superSchema.plugin(uniqueValidator);
module.exports = mongoose.model("superadmin",superSchema);