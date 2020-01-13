'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const modules = require('../models/module.js')
const permission = require('../models/permission.js')

const Submodule = sequelize.define('tbl_submodule', {
  sumo_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  sumo_description: {
    type: Sequelize.STRING
  },
  sumo_url:{
    type: Sequelize.STRING
  },
  sumo_icon:{
    type: Sequelize.STRING
  },
  sumo_order:{
    type: Sequelize.INTEGER
  },
  sumo_modu:{
    type: Sequelize.INTEGER
  }
}, {timestamps: false, tableName: 'tbl_submodule'});
  
Submodule.associate = function(models) {
  Submodule.belongsTo(models.modules, {
    foreignKey: 'sumo_modu',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
  Submodule.hasMany(models.permission, {
    foreignKey: 'perm_sumo',
    as: 'permission'
  });
};

module.exports = Submodule

