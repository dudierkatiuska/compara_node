'use strict'
const Sequelize = require('sequelize');
const {sequelize} = require('../config/config.js');

const Setting = sequelize.define('tbl_setting', {
  sett_ide: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  sett_logo: {
    type: Sequelize.STRING
  },
  sett_sect1:{
    type: Sequelize.STRING,
},
  sett_sect2: { 
    type: Sequelize.STRING,
},
  sett_sect3:{ 
    type: Sequelize.STRING,
},
  sett_sect4:{ 
    type: Sequelize.STRING,
},
  sett_sect5:{ 
    type: Sequelize.STRING,
},
  sett_banner:{ 
        type: Sequelize.STRING,
}
}, {timestamps: false, tableName: 'tbl_setting'});

Setting.associate = function(models) {

};

module.exports = Setting

