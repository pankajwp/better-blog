

module.exports = function(Sequelize, connection)
{
		var Categories = connection.define('category',
							// var categoryModel = config.define('catdatas',
									{
										id: {
													type: Sequelize.INTEGER,
													autoIncrement: true,
													primaryKey: true
												},
										name: Sequelize.STRING,
									},
									{
										underscored: false // column name should be camelCase
									},
									{
										associate: function(models) {
											console.log('ss');
											Categories.hasMany(models.blogs);
										}
									}
								);
								
								
		Categories.deleteBlogs = function(catId, blogModel, callback){
			
			blogModel.count({where: {categoryId : catId}}).then(function(limit){
				if(limit > 0){
						blogModel.destroy({where: {categoryId : catId}, limit}).then(
							function(success){
								callback(null, success);
							},
							function(err){
								callback(err);
							}
						)
				}
			});
				
		}
		return Categories;
}