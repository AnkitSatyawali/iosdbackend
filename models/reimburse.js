const mongoose = require('mongoose');
const reimburseSchema = mongoose.Schema({
	name: {type:String , required:true},
    amount : {type: Number,required:true},
    eventName: {type:String,required:true},
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'admin'
    },
    billname :{type:String,required:true},
    state : {type:String,required:true,default:"applied"}
});
module.exports = mongoose.model("reimburse",reimburseSchema);