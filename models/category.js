'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const Subcategory = require('../models/subcategory.js')
const User = require('../models/user.js')

const Category = sequelize.define('tbl_category', {
  cate_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  cate_description: {
    type: Sequelize.STRING
  },
  cate_status:{
    type: Sequelize.CHAR
  },
  cate_url:{
    type: Sequelize.STRING
  }
}, {timestamps: false, tableName: 'tbl_category'});

Category.associate = function(models) {
    Category.belongsToMany(models.tbl_user, {
        through: 'tbl_usercate',
        as: 'tbl_user',
        foreignKey: 'usca_cate'
      });
    Category.hasMany(models.Subcategory, {
    foreignKey: 'suca_cate',
    as: 'Subcategory'
  });
};

 module.exports = Category

