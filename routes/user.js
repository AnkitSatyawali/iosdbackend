const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function(req,file,cb) {
       cb(null,"./files/");
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

router.post('/register',upload.single('filename'),(req,res,next)=>{
    console.log(req.file);
    const url = req.protocol + "://" + req.get("host");
	const user = new User({
		username : req.body.username,
		phone: req.body.phone,
		email:req.body.email,
		college:req.body.college,
		year:req.body.year,
		filename: url + '/'+req.file.path
	});
	console.log(user);
	user.save().then(createdPost => {
		res.status(200).json({
			message:"User added successfully",
		});
	}).catch(error => {
		console.log(error);
		res.status(500).json({
			message:"User creation failed"
		});
	});
});

router.get('/fetchusers',(req,res,next) => {
	const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const userQuery = User.find();
    let fetchedUsers;
    /*if(pageSize && currentPage)
    {
      eventQuery.skip(pageSize*(currentPage-1))
      .limit(pageSize);
    }*/
    userQuery.then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(count => {
    	console.log(count);
    	console.log(pageSize);
    	console.log(Math.ceil(count / pageSize));
    	 const pageCount = Math.ceil(count / pageSize);
        let page = parseInt(currentPage);
        if (!page) { page = 1;}
        if (page > pageCount) {
            page = pageCount
          }
        res.status(200).json({
        "page": page,
        "pageCount": pageCount,
         "posts": fetchedUsers.slice(page * pageSize - pageSize, page * pageSize)
        });
    })
    .catch(error=>{
      res.status(500).json({
         message: "Fetching users failed"
      });
    });
});
router.put('/update/:ID',(req,res,next) => {
	console.log(req.body);
	let filePath = req.body.filename;
	console.log(filePath);
	if(req.file)
	{
		const url = req.protocol + "://" + req.get("host");
       filePath = url + "/" + req.file.filename;
	}
	const user = new User({
		_id:req.params.ID,
	    name : req.body.name,
		phone: req.body.phone,
		email:req.body.email,
		college:req.body.college,
	    year:req.body.year,
		filename:filePath
    });
    console.log(user);
      User.updateOne({_id:req.params.ID},user).then(result=>{
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
         message: "Couldn't update user!"
      });
     });

});
router.delete('/delete/:id',(req,res,next) => {
	 User.deleteOne({_id:req.params.id}).then(result => {
	 	console.log(result);
        if(result.n>0)
         {
           res.status(200).json({message:"User deleted"});
         }    
         else{
           res.status(401).json({message: "Not Authorized"});
         }
        
    })
    .catch(error=>{
      res.status(500).json({
         message: "Deleting user failed"
      });
    });
});
module.exports = router;