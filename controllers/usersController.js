var db = require('../config');
var bodyParser = require('body-parser');

module.exports = function(app){
		
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		
		
		
		app.post('/add/user', function(req, res){
			if(req.body.name)
			{
				// res.json(db.users);
				db.users.create(req.body).then(
					function(saved){
						res.status(200).send('Users Created:'+saved);
					},
					function(err){
						res.status(500).send(err);
					}
				)
			}
		});
		
		app.get('/bulkAdd', function(req, res){				
				var user = [
					{
						name: 'Pankaj',
						pwd: '123456',
					},
				  {
						name: 'Rahul',
						pwd: '123456',
					},
				  {
						name: 'Nitin',
						pwd: '123456',
					},
				  {
						name: 'Neeraj',
						pwd: '123456',
					}				   
				];
				
				db.users.bulkCreate(user).then(
					function(){
						res.status(200).send('Inserted Datas');
					},
					function(err){
						res.status(500).send(err);
					}
				)
		});		
		
		app.get('/usersdelete/:id', function(req, res){
			db.users.destroy({where:{id: req.params.id}, truncate:true}).then(function(){res.send('truncated')}, function(err){res.status(500).send(err)});
		});
};