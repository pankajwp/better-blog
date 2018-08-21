
module.exports = function(Sequelize, connection)
{
		var Tags = connection.define('tag', 
				{
					id: {
								type: Sequelize.INTEGER,
								primaryKey: true,
								autoIncrement: true,							
							},
					name: Sequelize.STRING,
				}
		);
		return Tags;
}

// tagModel.beforeCreate(function(tag, fn){
			// tag.name = tag.name.toLowerCase();
			// return tag;
	// });