const sequelize = require('sequelize');

const connection = new sequelize('questionguide', 'root', '123456',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;