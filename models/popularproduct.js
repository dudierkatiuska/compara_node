'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');

const Popularproduct = sequelize.define('tbl_popularproduct', {
  popr_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  popr_description: {
    type: Sequelize.STRING
  },
  popr_count:{
    type: Sequelize.STRING
  },
  popr_date:{
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE
  }
}, {timestamps: false, tableName: 'tbl_popularproduct'});

// Popularproduct.associate = function(models) {
// };

 module.exports = Popularproduct

