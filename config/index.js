var Sequelize = require('sequelize');
var config = require('./config');

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

var connection = new Sequelize(config.dbname, config.uname, config.pwd, {
									port: '3306',
									host: 'localhost',
									dialect: 'mysql',
									operatorsAliases:operatorsAliases,
									timezone: 'Asia/Calcutta',
									logging: false
								});

// Connect all the models/tables in the database to a db object, 
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;  
db.connection = connection;

db.users = require('../models/users')(Sequelize, connection);
db.blogs = require('../models/blogs')(Sequelize, connection);
db.tags = require('../models/tags')(Sequelize, connection);
db.categories = require('../models/categories')(Sequelize, connection);
db.blogTags = require('../models/blog_tags')(Sequelize, connection);
db.blogCats = require('../models/blog_cat_datas')(Sequelize, connection);

db.categories.hasMany(db.blogs, {foreignKey: 'categoryId', onDelete: 'cascade', hooks: true });
db.blogs.belongsTo(db.categories);


db.blogs.belongsToMany(db.tags, { through: db.blogTags, unique: false,});
db.tags.belongsToMany(db.blogs, { through: db.blogTags, unique: false });

// db.blogs.belongsToMany(db.categories, { through: db.blogCats, unique: false });
// db.categories.belongsToMany(db.blogs, { through: db.blogCats, unique: false });

db.blogs.belongsTo(db.users);



module.exports = db;

