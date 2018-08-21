var db = require('../config');
var bodyParser = require('body-parser');

module.exports = function(app){
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:false}));
	
	app.post('/add/tag', function(req, res){
			
			db.tags.create(req.body).then(
				function(saved){
					res.status(200).send(saved);
				},
				function(err){
					res.status(500).send(err);
				}
			);
	});	
	
	app.get('/admin/tags', function(req, res){		
			res.render('admin/tags', {setData:{title:'Tags'}});
	});
	
	app.get('/admin/add_tag', function(req, res){		
			res.render('admin/add_tag', {setData:{title:'Add tag'}});
	});
	
	
	app.post('/admin/add_tag', function(req, res){
			
			db.tags.create(req.body).then(
				function(saved){
					res.status(200).send(saved);
				},
				function(err){
					res.status(500).send(err);
				}
			);
	});	
};