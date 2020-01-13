'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const user = require('../models/user.js')


const Access = sequelize.define('tbl_access', {
  acce_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  acce_username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        notEmpty: true
    }
},
  acce_password:{
    type: Sequelize.STRING,
  },
  acce_user:{ 
    type: Sequelize.INTEGER
  },
  acce_status:{ 
    type: Sequelize.CHAR
  }
}, {timestamps: false, tableName: 'tbl_access'});

Access.associate = function(models) {
  Access.belongsToMany(models.usertype, {
    through: 'accesstypeuser',
    as: 'usertype',
    foreignKey: 'actu_acce'
  });
  Access.belongsTo(models.user, {
    foreignKey: 'acce_user',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
};

module.exports = Access

