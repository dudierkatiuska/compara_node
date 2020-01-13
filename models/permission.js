'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const pemissioncrud = require('../models/permissioncrud.js')
const accesstypeuser = require('../models/accesstypeuser.js')
const submodule = require('../models/submodule.js')

const Permission = sequelize.define('tbl_permission', {
  perm_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  perm_actu: {
    type: Sequelize.INTEGER
  },
  perm_sumo:{
    type: Sequelize.INTEGER
  },
  perm_pecr:{ 
    type: Sequelize.INTEGER
  },
  perm_status:{ 
    type: Sequelize.CHAR
  }
}, {timestamps: false, tableName: 'tbl_permission'});

Permission.associate = function(models) {
  Permission.belongsTo(models.pemissioncrud, {
    foreignKey: 'perm_pecr',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
  Permission.belongsTo(models.accesstypeuser, {
    foreignKey: 'perm_actu',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
  Permission.belongsTo(models.submodule, {
    foreignKey: 'perm_sumo',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
};

  
module.exports = Permission

