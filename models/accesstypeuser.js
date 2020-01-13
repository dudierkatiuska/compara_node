'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const pemission = require('../models/permission.js')

const Accesstypeuser = sequelize.define('tbl_accesstypeuser', {
  actu_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  actu_acce: {
    type: Sequelize.INTEGER
  },
  actu_usty:{
    type: Sequelize.INTEGER
  }
}, {timestamps: false, tableName: 'tbl_accesstypeuser'});


Accesstypeuser.associate = function(models) {
  Accesstypeuser.belongsTo(models.specialities, {
    foreignKey: 'actu_spec',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
  Accesstypeuser.hasMany(models.permission, {
    foreignKey: 'perm_actu',
    as: 'permission'
  });
  Accesstypeuser.hasMany(models.request, {
    foreignKey: 'requ_emisor',
    as: 'request'
  });
  Accesstypeuser.hasMany(models.liveevents, {
    foreignKey: 'live_actu',
    as: 'liveevents'
  });
  Accesstypeuser.hasMany(models.rating, {
    foreignKey: 'rati_actu',
    as: 'rating'
  });
};

module.exports = Accesstypeuser

