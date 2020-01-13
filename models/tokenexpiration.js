'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const User = require('../models/user.js')

const Tokenexpiration = sequelize.define('tbl_tokenexpiration', {
  toex_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  toex_user: {
    type: Sequelize.INTEGER
  },
  toex_token: {
    type: Sequelize.STRING
  },
}, {timestamps: false, tableName: 'tbl_tokenexpiration',underscored: true});

Tokenexpiration.associate = function(models) {
  Tokenexpiration.hasMany(models.User, {
    foreignKey: 'user_ide',
    as: 'User'
  });
};

module.exports = Tokenexpiration

