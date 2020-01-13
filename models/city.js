'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');

const City = sequelize.define('tbl_city', {
  city_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  city_description: {
    type: Sequelize.STRING
  },
  city_status:{
    type: Sequelize.CHAR
  },
}, {timestamps: false, tableName: 'tbl_city'});

City.associate = function(models) {
  City.hasMany(models.User, {
    foreignKey: 'user_city',
    as: 'User'
  });
};

module.exports = City

