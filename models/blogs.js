
module.exports = function(Sequelize, connection)
{
		var Blogs = connection.define('blog', 
			{
				id: {
							type: Sequelize.INTEGER,
							primaryKey: true,
							autoIncrement: true,							
						},
				categoryId: {
										type: Sequelize.INTEGER,
										foreignKey: true,										
									},
				userId: Sequelize.INTEGER,
				title: Sequelize.STRING,
				slug: Sequelize.STRING,
				description: Sequelize.STRING,
				banner: Sequelize.STRING
			},
			{
				associate: function (db){
					 Blogs.belongsTo(db.categories)
				}
			}
		);
		return Blogs;
}