'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');
const Category = require('../models/category.js')
const access = require('../models/access.js')



const User = sequelize.define('tbl_user', {
  user_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  user_name: {
    type: Sequelize.STRING
  },
  user_email:{
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        isEmail:true
    },
    unique: {
        args: true,
        msg: 'Dirección de correo electrónico ya está en uso'
        }
},
  user_birthdate: { 
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE
  },
  user_aboutme:{ 
    type: Sequelize.STRING
  },
  user_avatar:{ 
    type: Sequelize.STRING
  },
  user_city:{ 
    type: Sequelize.STRING
  },
  user_mobile:{ 
    type: Sequelize.STRING
  },
  user_dtregister:{ 
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE
  },
  user_dtactivation:{ 
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE
  }
}, {timestamps: false, tableName: 'tbl_user'});

User.associate = function(models) {
    User.belongsToMany(models.Category, {
        through: 'tbl_usercate',
        as: 'tbl_category',
        foreignKey: 'usca_user'
      });
    User.hasMany(models.access, {
      foreignKey: 'acce_user',
      as: 'access'
    });
};

module.exports = User

