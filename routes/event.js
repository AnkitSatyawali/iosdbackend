const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function(req,file,cb) {
       cb(null,"./posters/");
	},
	filename: function(req,file,cb) {
		cb(null,new Date().toISOString()+file.originalname);
	}
});
const fileFilter = (req,file,cb) => {
	var ext = path.extname(file.originalname);
	if(ext === '.jpeg' || ext === '.png'){
		cb(null,true);
	}else {
		return cb(null,new Error('Only images are allowed'));
	}
};
const upload = multer({storage:storage,fileFilter:fileFilter});

router.post('/create',upload.single('poster'),(req,res,next)=>{
	const url = req.protocol + '://' + req.get("host");
	const event = new Event({
		title : req.body.title,
		chapter: req.body.chapter,
		date:req.body.date,
		time:req.body.time,
	    link:req.body.link,
	    eventType:req.body.eventType,
	    description:req.body.description,
		poster: url+"/" + req.file.path
	});
	Event.findOne({title:req.body.title}).then(result => {
    if(!result){
      event.save().then(createdPost => {
    res.status(200).json({
      message:"Event added successfully",
    });
    }).catch(error => {
    res.status(500).json({
      message:"Event creation failed"
    });
    });
    }
		res.status(200).json({message:"Title already in use"});
  });
});


router.get('/fetch/:chapter',(req,res,next) => {
	const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const eventQuery = Event.find({chapter:req.params.chapter});
    let fetchedEvents;
    /*if(pageSize && currentPage)
    {
      eventQuery.skip(pageSize*(currentPage-1))
      .limit(pageSize);
    }*/
    eventQuery.then(documents => {
      fetchedEvents = documents;
      return Event.count();
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
         "posts": fetchedEvents.slice(page * pageSize - pageSize, page * pageSize)
        });
    })
    .catch(error=>{
      res.status(500).json({
         message: "Fetching events failed"
      });
    });
});

router.get('/fetchone/:id',(req,res,next) => {
	Event.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post);
        }
        else {
            res.status(404).json({message:'Event not found'});
        }
    })
    .catch(error=>{
      res.status(500).json({
         message: "Fetching post failed"
      });
    });
});

/*router.get('/fetch',(req,res,next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const eventQuery = Event.find();
    let fetchedEvents;
    if(pageSize && currentPage)
    {
      eventQuery.skip(pageSize*(currentPage-1))
      .limit(pageSize);
    }
    eventQuery.then(documents => {
      fetchedEvents = documents;
      return Event.count();
    })
    .then(count => {
       res.status(200).json({
          message: 'Events fetched successfully',
          posts: fetchedEvents,
          maxPosts:count
       });
    })
    .catch(error=>{
      res.status(500).json({
         message: "Fetching events failed"
      });
    });
});*/

router.put('/update/:ID',(req,res,next) => {
	console.log(req.body);
	let imagePath = req.body.poster;
	console.log(imagePath);
	if(req.file)
	{
		const url = req.protocol + "://" + req.get("host");
       imagePath = url + "/images/" + req.file.filename;
	}
	const event = new Event({
		_id:req.params.ID,
	    title : req.body.title,
		chapter: req.body.chapter,
		date:req.body.date,
		time:req.body.time,
	    link:req.body.link,
	    eventType:req.body.eventType,
	    description:req.body.description,
		poster:imagePath
    });
      Event.updateOne({_id:req.params.ID},event).then(result=>{
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

});

router.delete('/delete/:id',(req,res,next) => {
	 Event.deleteOne({_id:req.params.id}).then(result => {
	 	console.log(result);
        if(result.n>0)
         {
           res.status(200).json({message:"Event deleted"});
         }    
         else{
           res.status(401).json({message: "Not Authorized"});
         }
        
    })
    .catch(error=>{
      res.status(500).json({
         message: "Deleting event failed"
      });
    });
});
module.exports = router;