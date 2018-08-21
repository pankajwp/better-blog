
module.exports = function(Sequelize, connection)
{
		var BlogTags = connection.define('blog_tags', {				
				blogId: Sequelize.INTEGER,
				tagId: Sequelize.INTEGER,
		});
		return BlogTags;
}