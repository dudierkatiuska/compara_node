'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const Usersocial = require('../models/usersocial.js')
const User = require('../models/user.js')

const Social = sequelize.define('tbl_social', {
  soci_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  soci_description: {
    type: Sequelize.STRING
  },
  soci_icon:{
    type: Sequelize.STRING
  }
}, {timestamps: false, tableName: 'tbl_social'});

Social.associate = function(models) {
  Social.belongsToMany(models.tbl_user, {
    through: 'tbl_usersocial',
    as: 'tbl_user',
    foreignKey: 'usso_social'
  });
};

module.exports = Social

