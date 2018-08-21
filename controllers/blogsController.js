var moment = require('moment');
var multer = require('multer');
var slugify = require('slugify');

 var storage =   multer.diskStorage({
  // file upload destination
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
		var fileEx = file.originalname.split('.');
    callback(null, file.fieldname + '-' + Date.now()+'.'+fileEx[fileEx.length - 1]);
  }
});

var bannerUpload = multer({ 
										storage : storage,
										fileFilter: function (req, file, cb) {
											 if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
												req.fileValidationError = 'goes wrong on the mimetype';
												return cb(null, false, new Error('Invalid file type only image file type should be uploaded'));
											 }
											 cb(null, true);
											}
									}).single('banner');

module.exports = function(app, db){
	
	app.get('/admin/blogs', function(req, res){
		setData = {title: 'Blog Lists', moment:moment};
		// res.send('ddd');
		db.blogs.findAll({include: [db.categories]}).then(
			function(blogLists){
				// res.send(blogLists);
				res.status(200).render('admin/blogs', {setData, blogLists});
			},
			function(err){
				res.status(500).send(err);
			}
		)
	});	
	
	
	app.get('/admin/add_blog', function(req, res){
		var setData =  {title: 'Add Blog'};
		db.categories.findAll().then(
					function(categories){						
						// res.send(categories);
						res.status(200).render('admin/add_blog', {setData, categories});
					},
					function(err){
						res.send(err);
					}
				);		
	});
	
	app.get('/admin/edit_blog/:id', function(req, res){
		var setData =  {title: 'Edit Blog'};
		db.categories.findAll().then(
					function(categories){
						db.blogs.findById(req.params.id, {include: [db.categories, db.tags]}).then(
							function(blogData){
									var tagsArr = [];
									var tagLists = blogData.tags.map(tag => 									
										tag.name
									)
								// res.send(tagLists);
								// res.send(blogData);
							res.status(200).render('admin/edit_blog', {setData, categories, tagLists, blogData});
							},
							function(err){
								res.send(err);
							}
						)
					},
					function(err){
						res.send(err);
					}
				);		
	});
	
	
	app.post('/admin/edit_blog/:id', function(req, res){
			// var body = req.body;
			// res.status(200).send(body);
			if(req.params.id){
				db.blogs.findOne({where: { id:req.params.id }}).then(
					function(blogData){
						bannerUpload(req,res,function(err) { 
							if(err) {
									return res.end("Error uploading file.");
							}else if(req.fileValidationError) {
									return res.end(req.fileValidationError);
							}
								
								// console.log(typeof(req.file));
								
								 req.body.banner = (typeof(req.file) !=='undefined')?req.file.filename:req.body.oldbanner;
								var body = req.body;
								body.slug = slugify(body.title, {
																replacement: '-',    // replace spaces with replacement
																remove: null,        // regex to remove characters
																lower: true          // result in lower case
															});
								// res.send(body);
								body.tags = body.tags.split(',');
					
								const fcTags = body.tags.map(tag => 
								db.tags.findOrCreate({where: { name:tag }, defaults: {name:tag.name}})
												.spread((tag, created) => tag));
								db.blogTags.destroy({where: {blogId: req.params.id}}).then(
									function(success){
										blogData.updateAttributes(body).then(blog => Promise.all(fcTags).then(storedTags => blog.addTags(storedTags)).then(() => res.status(200).redirect('/admin/blogs'))
											)	
									}							
								)
						});
							
					},
					function(err){
						res.status(500).send(err);
					}
				);
			}
	});
	
	app.post('/admin/add_blog', function(req, res){			 
			
			bannerUpload(req,res,function(err) { 
        if(err) {
            return res.end("Error uploading file.");
        }else if(req.fileValidationError) {
            return res.end(req.fileValidationError);
        }
					req.body.banner = req.file.filename;
					var body = req.body;
					body.tags = body.tags.split(',');			
					body.banner = req.file.filename;
					body.slug = slugify(body.title, {
																replacement: '-',    // replace spaces with replacement
																remove: null,        // regex to remove characters
																lower: true          // result in lower case
															});
					const tags = body.tags.map(tag =>
							db.tags.findOrCreate({where: { name:tag }, defaults: { name:tag.name } })
											.spread((tag, created)=>tag));				
					
					db.users.findById(body.userId).then(					
						db.blogs.create(body)
						.then(blog => Promise.all(tags).then(storedTags => blog.addTags(storedTags)).then(() => res.status(200).redirect('/admin/blogs')))
					).catch(function(err){
							res.status(500).send(err);
					});
			});
			
			
	});
	
	app.get('/admin/delete_blog/:id', function(req, res){
		if(req.params.id){
			db.blogs.destroy({where: {id: req.params.id}, limit:1}).then(
				function(response){
					if(response){
						db.blogTags.count({where: {blogId: req.params.id}}).then(
							function(limit){
								if(limit > 0){
									db.blogTags.destroy({where: {blogId: req.params.id}, limit:limit}).then(
										function(success){
											if(success){
												req.flash('success_msg', 'Blog deleted !');
												res.redirect('/admin/blogs');
											}else{
												res.send('blog tag table error');
											}
										}
									)									
								}
							}
						)
					}else{
						res.send("Blog not deleted");
					}
				}
			);			
		}
	});
	
	/* app.post('/add/blog', function(req, res){
			
			var body = req.body;
			// res.send(typeof(body.tags));			
			const tags = body.tags.map(tag =>
						db.tags.findOrCreate({where: { name:tag.name }, defaults: { name:tag.name } })
										.spread((tag, created)=>tag));				
				// res.send(tags);
			db.users.findById(body.userId).then(					
					db.blogs.create(body)
					.then(blog => Promise.all(tags).then(storedTags => blog.addTags(storedTags)).then(() => res.send(blog)))
				).catch(function(err){
						res.status(500).send(err);
				});
	});
	
	app.post('/add/blog/cat', function(req, res){
			
			var body = req.body;
			// res.send(typeof(body.tags));			
			const cats = body.cats.map(cat =>
						db.categories.findOrCreate({where: { name:cat.name }, defaults: { name:cat.name } })
										.spread((cat, created)=>cat));				
				// res.send(tags);
			db.users.findById(body.userId).then(			
					db.blogs.create(body)
					.then(blog => Promise.all(cats).then(storedCats => blog.addCat_datas(storedCats)).then(() => res.send(blog))) 
					// addCat_datas if the table name id cat_datas
					//.then(blog => Promise.all(cats).then(storedCats => blog.addCatdatas(storedCats)).then(() => res.send(blog)))
				).catch(function(err){
						res.status(500).send(err);
				});
	});
	
	app.get('/view/article/:id', function(req, res){
			if(req.params.id){
				db.blogs.findAll({ 
								where:{id: req.params.id}, 
								include : [
									{model: db.users}									
								]					
				}).then(
					function(blogData){
						res.status(200).send(blogData);
					},
					function(err){
						res.status(500).send(err);
					}
				);
			}
	});	 */
};