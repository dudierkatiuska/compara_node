'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const submodule = require('../models/submodule.js')

const Module = sequelize.define('tbl_module', {
  modu_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  modu_description: {
    type: Sequelize.STRING
  },
  modu_visibility:{
    type: Sequelize.INTEGER
  },
  modu_icon:{
    type: Sequelize.STRING
  }
}, {timestamps: false, tableName: 'tbl_module'});

Module.associate = function(models) {
  Module.hasMany(models.submodule, {
    foreignKey: 'sumo_modu',
    as: 'submodule'
  });
};

module.exports = Module

