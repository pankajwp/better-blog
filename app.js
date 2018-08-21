var express = require('express');
var expresslayout = require('express-ejs-layouts');

var app = express();
var config = require('./config');
var usersController = require('./controllers/usersController')
// var blogsController = require('./controllers/blogsController')
var pagesController = require('./controllers/pagesController')
var adminController = require('./controllers/adminController')

var port = process.env.PORT || 3000;
app.use('/assets', express.static(__dirname+'/public'));
app.use(expresslayout);

app.set('view engine', 'ejs');

// Setting global varaible
app.use((req, res, next) => {
		res.locals.baseUrl = '/';
		next();
});

// config.authenticate().then(
		// function(){
			// console.log('Connection established');
		// }).catch(function(err){
			// console.log('Unable to connect to database: '+ err);
		// });
usersController(app);
// blogsController(app);
pagesController(app);
adminController(app);

app.listen(port);