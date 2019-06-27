const express = require("express");
const router = express.Router();
const superAdmin = require("../models/superadmin");
const Reimburse = require("../models/reimburse");
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function(req,file,cb) {
       cb(null,"./bills/");
	},
	filename: function(req,file,cb) {
		cb(null,new Date().toISOString()+file.originalname);
	}
});
const fileFilter = (req,file,cb) => {
	var ext = path.extname(file.originalname);
	if(ext === '.pdf') {
           cb(null,true);
    }else {
		return cb(null,new Error('Only pdf files are allowed'));
	}
};
const upload = multer({storage:storage,fileFilter:fileFilter});
router.post('/upload',upload.single('billname'),(req,res,next)=>{
    console.log(req.file);

    const url = req.protocol + "://" + req.get("host");
	const reimburse = new Reimburse({
		name : req.body.name,
		amount: req.body.amount,
		eventName:req.body.eventname,
		createdBy:req.body.id,
		billname: url + '/'+req.file.path
	});
	console.log(reimburse);
	reimburse.save().then(createdPost => {
		res.status(200).json({
			message:" added successfully",
		});
	}).catch(error => {
		console.log(error);
		res.status(500).json({
			message:"Reimburse creation failed"
		});
	});
});

router.put('/update/:id',(req,res,next) => {
   superAdmin.findOne({_id:req.params.id}).then(result => {
       if(result)
       {
       const reimburse = new Reimburse({
		_id:req.body._id,
	    name: req.body.name,
		amount: req.body.amount,
		eventName:req.body.eventname,
		createdBy : req.body.createdBy,
		billname:req.body.billname,
		state  : req.body.state
    });
       console.log(reimburse);
        Reimburse.updateOne({_id:req.body._id},reimburse).then(result=>{
         if(result.nModified>=0)
         {
           res.status(200).json({message: "Updated successfully"})
         }    
         else{
           res.status(401).json({message: "Not Authorized"});
         }
     })
     .catch(error => {
     	console.log(error);
      res.status(500).json({
         message: "Couldn't update post!"
      });
     });
     }
     else
     {
     	res.status(500).json({message:"User not authenticated"});
     } 
   });  
});
router.delete('/delete/:id',(req,res,next) => {
	Reimburse.deleteOne({_id:req.params.id}).then(result => {
	 	console.log(result);
        if(result.n>0)
         {
           res.status(200).json({message:"Reimburse deleted"});
         }    
         else{
           res.status(401).json({message: "Not Authorized"});
         }
        
    })
    .catch(error=>{
      res.status(500).json({
         message: "Deleting reimburse failed"
      });
    });
});
module.exports = router;


