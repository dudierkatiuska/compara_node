'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');

const Store = sequelize.define('tbl_store', {
  stor_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  stor_name: {
    type: Sequelize.STRING
  },
  stor_url:{ 
    type: Sequelize.STRING
  },
  stor_typestore:{ 
    type: Sequelize.STRING
  },
  stor_userkey:{ 
    type: Sequelize.STRING
  },
  stor_secretkey:{ 
    type: Sequelize.STRING
  },
  stor_city:{ 
    type: Sequelize.STRING
  },
  stor_logo:{ 
    type: Sequelize.STRING
  },
  stor_status:{ 
    type: Sequelize.CHAR
  }
}, {timestamps: false, tableName: 'tbl_store'});

Store.associate = function(models) {

};

module.exports = Store

