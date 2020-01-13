'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');

const Product = sequelize.define('tbl_product', {
  prod_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  prod_name: {
    type: Sequelize.STRING
  },
  prod_price:{
    type: Sequelize.STRING
  },
  prod_link:{
    type: Sequelize.STRING
  },
  prod_src:{
    type: Sequelize.STRING
  },
  prod_url:{
    type: Sequelize.STRING
  },
  prod_categories:{
    type: Sequelize.TEXT
  },
  prod_attribute:{
    type: Sequelize.TEXT
  },
  prod_logo:{
    type: Sequelize.STRING
  }
}, {timestamps: false, tableName: 'tbl_product'});

Product.associate = function(models) {
};

 module.exports = Product

