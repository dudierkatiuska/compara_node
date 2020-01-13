'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const permission = require('../models/permission.js')

const Pemissioncrud = sequelize.define('tbl_pemissioncrud', {
  pecr_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  pecr_description: {
    type: Sequelize.STRING
  },
  pecr_url:{
    type: Sequelize.STRING
  },
  pecr_icon:{ 
    type: Sequelize.STRING
  }
}, {timestamps: false, tableName: 'tbl_pemissioncrud'});

Pemissioncrud.associate = function(models) {
  Pemissioncrud.hasMany(models.permission, {
    foreignKey: 'perm_pecr',
    as: 'permission'
  });
};

module.exports = Pemissioncrud


