
module.exports = function(app, db){
	
	app.get('/admin/add', function(req, res){
		db.users.findAll().then(
			function(users){
				res.json(users);
			},
			function(err){
				res.status(500).send(err);
			}
		)
		// res.render('/admin/add_post', {setData:{title: 'Add Post'}});
	});
	
}