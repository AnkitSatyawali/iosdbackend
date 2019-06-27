const express = require("express");
const PostController = require("../controllers/post");
const router = express.Router();
const Post = require("../models/post");
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(req,file,cb) {
       cb(null,"./uploads/");
	},
	filename: function(req,file,cb) {
		cb(null,new Date().toISOString()+file.originalname);
	}
});
const fileFilter = (req,file,cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null,true);
	}else {
		cb(null,false);
	}
};
const upload = multer({storage:storage,fileFilter:fileFilter});

router.post('/post',upload.single('image'),(req,res,next) =>{
	console.log(req.file);
	const post = new Post({
		title : req.body.title,
		description : req.body.description,
		username:req.body.username,
		image: req.file.path
	});
	post.save().then(createdPost => {
		res.status(200).json({
			message:"Post added successfully",
		});
	}).catch(error => {
		res.status(500).json({
			message:"Post creation failed"
		});
	});
});

router.get('/fetch/:username',(req,res,next) => {
    Post.findOne({username:req.params.username}).then(post=>{
        if(post){
            res.status(200).json(post);
        }
        else {
            res.status(404).json({message:'Post not found'});
        }
    })
    .catch(error=>{
      res.status(500).json({
         message: "Fetching post failed"
      });
    });
});
module.exports = router;