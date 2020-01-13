'use strict'
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const sequelize = new Sequelize(
                              'dbpg_akipartes',
                              'postgres',
                              'fabi17501515',
                              {
                                host: 'localhost',
                                port: '5432',
                                dialect: 'postgres', 
                                pool:{
                                  max:5,
                                  min:0,
                                  require:30000,
                                  idle:10000
                                }
                              }
                          )

sequelize.authenticate()
  .then(() => {
    console.log('Conectado')
  })
  .catch(err => {
    console.log('No se conecto')
  })

module.exports.sequelize = sequelize 
module.exports.op = Op 