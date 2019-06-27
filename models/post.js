const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const postSchema = mongoose.Schema({
	title :  {type:String , required:true},
    description : {type: String,required:true},
    username:{type:String,required:true},
    image : {type:String,required:true}
});
postSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Post",postSchema);