

module.exports = function(Sequelize, connection)
{
		var BlogCats = connection.define('blog_cat_datas', 
			{				
				blogId: Sequelize.INTEGER,
				catDataId: Sequelize.INTEGER,
			}
		);
		return BlogCats;
}