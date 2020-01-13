'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');

const Favoriteproduct = sequelize.define('tbl_favoriteproduct', {
  fapr_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  fapr_user: {
    type: Sequelize.STRING
  },
  fapr_product:{
    type: Sequelize.STRING
  },
  fapr_date:{
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE
  }
}, {timestamps: false, tableName: 'tbl_favoriteproduct'});

Favoriteproduct.associate = function(models) {
};

 module.exports = Favoriteproduct

