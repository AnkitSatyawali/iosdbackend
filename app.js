const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/event');
const userRoutes = require('./routes/user');
const reimburseRoutes = require('./routes/reimburse');
const app = express();

mongoose.connect(config.database,{useNewUrlPaser: true})
.then(() => {
	console.log('Connected to database');
},
err => {
	console.log(err);
    console.log('Connection Failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/posters',express.static('posters'));
app.use('/files',express.static('files'));
app.use('/bills',express.static('bills'));
app.use('/',express.static(path.join(__dirname,'./../../index.html')));
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",
    	"Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods",
    	"GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});
app.use("/admin",adminRoutes);
app.use("/user",userRoutes);
app.use("/event",eventRoutes);
app.use("/reimbursement",reimburseRoutes);
module.exports = app;