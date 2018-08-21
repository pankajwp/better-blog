var moment = require('moment');

module.exports = function(app, db){
	
	app.get('/admin/categories', function(req, res){
		var setData = {title:'Categories List', moment:moment};
		
		db.categories.findAll().then(
			function(categories){
				res.status(200).render('admin/categories',{setData, categories});
			},
			function(err){
				res.status(500).send(err);
			}
		);
		
	});
	
	app.get('/admin/add_cat', function(req, res){
		var setData = {title:'Categories List'};		
		res.status(200).render('admin/add_cat', {setData});
	});
	
	app.get('/admin/view/cat/:id', function(req, res){
		var catId = db.categories.findById(req.params.id, {include:[ {model: db.blogs} ] }).then(
			function(cat){
				res.json(cat)
			},
			function(err){
				res.send(err);
			}
		);
	});
	
	app.get('/admin/view/blog/:id', function(req, res){
		var catId = db.blogs.findById(req.params.id, {include:[ {model: db.categories} ] }).then(
			function(blog){
				res.json(blog)
			},
			function(err){
				res.send(err);
			}
		);
	});
	
	app.get('/admin/edit_cat/:id', function(req, res){
		var setData = {title:'Edit Category'};		
		var catId = db.categories.findById(req.params.id).then(
			function(catData){
				res.status(200).render('admin/edit_cat', {setData,catData});
			},
			function(err){
				res.status(500).send(err);
			}
		);
	});
	
	app.post('/admin/edit_cat/:id', function(req, res){		
		if(req.body){
			db.categories.findById(req.params.id).then(
				function(catData){
					catData.updateAttributes(req.body).then(
						function(update){
							req.flash('success_msg', 'Category has been updated');
							res.redirect(req.url);
						},
						function(err){
							req.flash('error_msg', 'Unable to update category, please try latter.');
							res.redirect(req.url);
						}
					)
				},
				function(err){
					res.status(500).send(err);
				}
			);
		}
	});


	app.get('/admin/delete_cat/:id', function(req, res){
		var catId = req.params.id;
		db.categories.destroy({where: {id: catId}, limit:1}).then(
			function(success){
				if(success === 1){
					db.categories.deleteBlogs(catId, db.blogs, function(err, deleted){
						if(deleted){
							req.flash('success_msg', 'The category has been deleted');
							res.redirect('/admin/categories');
						}
					});					
				}
			},
			function(err){
				res.status(500).send(err);
			}		
		)
	});
	
	
	app.post('/admin/add_cat', function(req, res){
		if(req.body.name){
			var formData = {name: req.body.name};
			// res.send(formData);
			db.categories.create(formData).then(
				function(saveCat){					
					req.flash('success_msg', 'Category has been added.');
					// res.status(200).render('admin/categories', {setData:{title: 'Categories List'}, })
					res.redirect('/admin/categories');
				},
				function(err){
					res.send(500, err);
				}
			)
		}
	});
	
}