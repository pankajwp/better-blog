var bcrypt = require('bcryptjs');

module.exports = function(Sequelize, connection){
	
		var Users = connection.define('user', 
						{
							id: {
										type: Sequelize.INTEGER,
										primaryKey: true,
										autoIncrement: true
									},							
							name: Sequelize.STRING,
							username: Sequelize.STRING,
							email: Sequelize.STRING,
							pwd: Sequelize.STRING
						},
						{
							hooks: {
								beforeCreate: (user, options) => {
										// var encrptPass = user.pwd;
									 return new Promise((resolve, reject) => {
											bcrypt.genSalt(10, function(err, salt) {
													bcrypt.hash(user.pwd, salt, function(err, hash) {
															resolve(user.pwd = hash);													
													});
											});
									 });
								}										
							}
						}
					);
		
		Users.findByUsername = function(username, callback){
			Users.findOne({where: { username: username } }).then(
				function(users){
					callback(null, users);
				},
				function(err){
					callback(err);
				}
			);
		};
		
		
		Users.comparePassword = function(hashPass, inputPass, callback){
				bcrypt.compare(inputPass, hashPass, function(err, isMatch) {
						if(err) throw err;
						callback(null, isMatch);
				});
			// Users.findOne()
		};
		
		
		Users.getUserById = function(id, callback){			
				Users.findById(id).then(
					function(user){
						callback(null, user);
					},
					function(err){
						res.send(err);
					}
				);
		};
		
		return Users;
}



			

