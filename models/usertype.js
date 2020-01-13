'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const access = require('../models/access.js')

const Usertype = sequelize.define('tbl_usertype', {
  usty_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  usty_description: {
    type: Sequelize.STRING
  },
  usty_status:{
    type: Sequelize.CHAR
  }
}, {timestamps: false, tableName: 'tbl_usertype'});

Usertype.associate = function(models) {
  Usertype.belongsToMany(models.access, {
    through: 'accesstypeuser',
    as: 'access',
    foreignKey: 'actu_usty'
  });
};

module.exports = Usertype

