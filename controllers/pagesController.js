var moment = require('moment');	
var db = require('../config');
var bodyParser = require('body-parser');

module.exports = function(app){
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:false}));
	
	app.get('/', function(req, res){
			
		var setData = {title:'Node Blog', moment: moment};
		let limit = 2;   // number of records per page
		let offset = 0;
		db.blogs.findAll({where: { featured:1 }, limit:3, include: [{model: db.users}] }).then(
				function(fBlogs){
					db.blogs.findAndCountAll()
					.then((data) => {
						let cpage = (typeof(req.query.cpage) !== 'undefined')?req.query.cpage:1;      // page number
						let pages = Math.ceil(data.count / limit);
						offset = limit * (cpage - 1);
						db.blogs.findAll({					
							limit: limit,
							offset: offset,
							include: [db.tags]
						})
						.then((allBlogs) => {
							setData.fBlogs_big = fBlogs[0];
							setData.fBlogs_small = [fBlogs[1], fBlogs[2]];
							// res.status(200).json({setData, allBlogs,fBlogs, 'count': data.count, limit, layout: 'layout'});
							res.status(200).render('index', {setData, allBlogs, cpage, 'count': data.count, pages, layout: 'layout'});
						});
					})
					.catch(function (error) {
						res.status(500).send('Internal Server Error');
					});			
				},
				function(err){
					res.send(err);
				}
			);
	});
	
	app.get('/article/:slug', function(req, res){
			var qSlug = req.params.slug;
			db.blogs.findOne({where: { slug:qSlug }, include:[db.tags, db.users]}).then(
				function(blog){
					if(blog == null){
						res.sendStatus(404);
					}else{
						db.blogs.findOne({where: {id:{$gt: blog.id}}, limit: 1}).then(
							function(nextBlog){
								db.blogs.findOne({where: {id: {$lt: blog.id}}, limit: 1}).then(
									function(prevBlog){
										res.status(200).render('single', {blog, nextBlog, prevBlog, setData: {title: blog.title+' | Pankaj Wp'}, layout: 'layout'});											
									}
								)
							}
						)
					}
				},function(err){
					res.send('Error occured' + err);
				}				
			);
	})
		
	
	app.get('/contact', function(req, res){
		var setData = {	
			title:'Contact Us'			
		};
	res.render('contact', {setData, layout: 'layout'});
	});

	app.get('/about', function(req, res){
		var setData = {	
			title:'About Us'			
		};
		res.render('about', {setData, layout: 'layout'});
	});
	
	app.get('*',function(req,res){
	 res.render('404', {setData: {title: '404 Page Not Found'}, layout: 'layout'});
	});
	
};