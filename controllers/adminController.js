var db = require('../config');
var bodyParser = require('body-parser');

/* starts: modules for login */

var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local'), Strategy;

/* ends: modules for login */

module.exports = function(app){
	// Set Middelware
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));	
	app.use(cookieParser());
	
	// Express Session
	app.use(session({
			key: 'user_sid',
			secret: 'pankajwp',
			resave: false, 
			saveUninitialized: false			
	}));
	
	// Init passport authentication 
	app.use(passport.initialize());
	// persistent login sessions 
	app.use(passport.session());
	
	
	
	// Connect Flash
	app.use(flash());
	
	app.use('/admin', function(req, res, next){			
			if(req.url !== '/login' && req.url !== '/register')
			{				
				if(!req.user){
					req.flash('error', 'You are not authorized to access this location, please log in');
					res.redirect(req.baseUrl+'/login');
				}else{
					next();
				}
			}else{			
				next();
			}
				
	})
	
	
	// Setting Global varaibles
	app.use(function(req, res, next){
		res.locals.success_msg = req.flash('success_msg');
		res.locals.error_msg = req.flash('error_msg');
		res.locals.error = req.flash('error'); // because of passport error msg
		// res.locals.user = req.isAuthenticated(); // getting logged in user details
		res.locals.user = req.user; // getting logged in user details
		next()
	});
	
	
	
	app.set('layout', 'admin/layout');
	
	app.get('/admin', function(req, res){
	
			res.status(200).render('admin/dashboard', {setData:{title:'Dashboard'}});		
	});
	
	app.get('/admin/register', function(req, res){
		res.status(200).render('admin/register', {setData:{title:'Admin Register'}});
	});
	
	app.post('/admin/register', function(req, res){
		if(req.body.username && req.body.pwd){
			db.users.create(req.body).then(
				function(savedUser){
					res.json(savedUser);
					// res.status(200).render(req.baseUrl+'admin/register', {setData:{title:'Dashboard'},success_msg:'The account has been created successfully.'});
				},
				function(err){
					res.status(500).send(err);
				}
			);
		}else{
			// res.redirect('/admin/register', {error: 'Username OR Password is not present'});
			res.render(req.baseUrl +'admin/register', {setData:{title:'Dashboard'}, error:'Username Or Password is not present',validated:req.body});
		}
	});	
	
	
	passport.use(new localStrategy(
		function(username, password, done) {
					db.users.findByUsername(username, function(err, users){
						if(err) throw err;
						if(!users){
							return done(null, false, {message: 'Invalid Username'});
						}
					// console.log(users);
					db.users.comparePassword(users.pwd, password, function(err, isMatch){
						if(err) throw err;
						if(isMatch){
							return done(null, users);
						}else{
							return done(null, false, {message:'Invalid Password'});
						}
					});
				});
			}
	));	
	
	
	passport.serializeUser(function(users, done) {		
		done(null, users.id);
	});

	passport.deserializeUser(function(id, done) {
		db.users.getUserById(id, function(err, users) {	
			done(err, users);
		});
	});
	
	app.get('/admin/login', function(req, res){
		res.status(200).render('admin/login', {setData:{title:'Admin Login'}});
	});
	
	app.get('/admin/logout', function(req, res){
		req.logout();
		req.flash('success_msg', 'You have are logged out');
		res.redirect('/admin/login');
	});
	
	app.post('/admin/login', passport.authenticate('local',{
			successRedirect: '/admin', failureRedirect: '/admin/login', failureFlash:true
	}), function(req, res){
			res.send('logged in');
	});
	
	
	require('./adminPostController')(app, db);
	require('./tagsController')(app, db);
	require('./categoriesController')(app, db);	
	require('./blogsController')(app, db);	
	
}