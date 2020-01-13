'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const User = require('../models/user.js')


const Token = sequelize.define('tbl_token', {
  toke_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  toke_description: {
    type: Sequelize.STRING
  },
  toke_user: {
    type: Sequelize.INTEGER
  },
}, {timestamps: false, tableName: 'tbl_token',underscored: true});

Token.associate = function(models) {
  Token.hasMany(models.User, {
    foreignKey: 'user_ide',
    as: 'User'
  });
};

module.exports = Token

