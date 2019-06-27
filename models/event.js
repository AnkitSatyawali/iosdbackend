const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
	title : {type:String , required:true,unique : true},
    chapter : {type: String,required:true},
    date : {type:String,required:true},
    time: {type:String,required:true},
    link: {type:String,required:true},
    eventType :{type:String,required:true},
    description :{type:String,required:true},
    poster : {type:String,required:true}
});

module.exports = mongoose.model("event",eventSchema);