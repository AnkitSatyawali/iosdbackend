const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const config = require('../config/database');

router.post('/login',(req,res,next) => {
   let fetchedUser;
	Admin.findOne({username: req.body.username}).then(admin=> {
		if(!admin){
			return res.status(401).json({message:'USER DOES NOT EXIST'});
		}
		fetchedUser = admin;
		return bcrypt.compare(req.body.password,admin.password);
	})
	.then(result => {
		console.log(result);
		if(!result) {
			return res.status(401).json({message:'Auth failed'});
		}
		const token = jwt.sign({username:fetchedUser.username,adminId:fetchedUser._id},config.JWT_KEY,{expiresIn:'1h'});
		res.status(200).json({
			token:token,
			expiresIn : 3600,
			adminId:fetchedUser._id
		});
		console.log(token);
	})
	.catch(err => {
		console.log(err);
		return res.status(401).json({
			message:"Invalid details"
		});
	});
});

router.post('/signup',(req,res,next) => {
	console.log(req.body);
    Admin.findOne({username:req.body.username}).then(result => {
    	console.log(result);
    	if(!result){
    		bcrypt.hash(req.body.password,10)
		.then(hash => {
	        const admin = new Admin({
			username : req.body.username,
			password : hash,
			chapter : req.body.chapter
		  });
	      admin.save().then(result => {
	         res.status(201).json({
	         	message: 'User created',
	         	result : result
	         });
	      })
	      .catch(err => {
	      	res.status(500).json({
	           message : "User creation failed"
	      	});
	      });
	     });   

    	}
    	else
    	{
    		res.status(401).json({message : "Username Already in use"});
    	}
    	
    })
		
});
module.exports = router;