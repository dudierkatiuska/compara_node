'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const Category = require('../models/category.js')

const Subcategory = sequelize.define('tbl_subcategory', {
  suca_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  suca_description: {
    type: Sequelize.STRING
  },
  suca_cate:{
    type: Sequelize.INTEGER,
      references: {
      model: "Category",
      key: "cate_ide"
    }
  },
  suca_status:{
    type: Sequelize.CHAR
  }
}, {timestamps: false, tableName: 'tbl_subcategory'});
  
Subcategory.associate = function(models) {
  Subcategory.belongsTo(models.Category, {
            onDelete: "RESTRICT",
            foreignKey: {
                fieldName: "suca_cate",
                allowNull: false,
                require: true
            },
            targetKey: "cate_ide",
            as: "Category"
        });
};


module.exports = Subcategory

