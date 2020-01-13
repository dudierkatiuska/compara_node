'use strict'
const {sequelize} = require('../config/config.js'),
    path = require('path'),
    store_model = require('../models/store.js'),
    encryption = require('../config/encryption'),
    { checkToken } = require('../config/tokens'),
    general_helpers = require('../config/helpers'),
    route_files = path.join(general_helpers.base_url, '/files/images/store/'),
    route_relative = 'images/store/',
    file_controller = require('fs')

async function createStore(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var check_request = await(general_helpers.validateParams('store', req))
    if (check_request !== 'Correcto') {
        return check_request
    }
    const data = {
        "stor_name" : req.body.name,
        "stor_url" : req.body.url,
        "stor_typestore" : req.body.typestore,
        "stor_userkey" : req.body.userkey,
        "stor_secretkey" : req.body.secretkey,
        "stor_city" : req.body.city,
        "stor_logo" : (req.body.logo.includes('data:image/'))?req.body.logo:'',
        "stor_status" : req.body.status,
    } 
    var image = req.body.logo
    if (image != undefined && image !== '' && image.includes('data:image/')) {
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
            route_store = route_files,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.stor_logo = route_relative_file
    }
    
    try {
        var result = await(store_model.create(data))
        return 'Tienda creada correctamente'
    } catch (e) {
        try {
            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file)); 
        } catch (e) {
        }
        return e.parent.detail
    } 
}

async function updateStore(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }


    var stor_ide = parseInt(req.params.stor_ide);
    var { name, url, typestore, userkey, secretkey, city, logo, status} = req.body;
    if (Number.isInteger(stor_ide) && stor_ide !== '') {
        const updatestore = await store_model.findAll({
            attributes: ['stor_ide','stor_name', 'stor_url', 'stor_typestore', 'stor_userkey', 'stor_secretkey', 'stor_city', 'stor_logo', 'stor_status'],
            where:{
                stor_ide 
            }
        });
        if (updatestore.length > 0) {
            return new Promise((resolve) => {
                updatestore.forEach(async store_model => {
                    var image = logo
                    if (updatestore[0].stor_logo !== '' && image !== undefined && image !== '' && image.includes('data:image/')) {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatestore[0].stor_logo)); 
                        } catch (e) {
                        }
                    }
                    if (image !== undefined && image !== '' && image.includes('data:image/')) {
                        var ba64 = require('ba64'),
                            route_relative_file = '',
                            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                            name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                            route_store = route_files,
                            fullname_file = route_store + '' + name_file
                            route_relative_file =  route_relative + name_file + '.jpeg'
                        ba64.writeImageSync(fullname_file, base64Data)
                        logo = route_relative_file
                    }
                    var results = ''
                    try {
                        var result = await (store_model.update({
                                                        stor_name: name,
                                                        stor_url: url,
                                                        stor_typestore: typestore,
                                                        stor_userkey: userkey,
                                                        stor_secretkey: secretkey,
                                                        stor_city : city,
                                                        stor_logo : logo,
                                                        stor_status : status


                                                }));
                        results = 'Tienda actualizada correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Tienda no encontrada")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Tienda inválida")
        })
    }
}

async function deleteStore(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var stor_ide = parseInt(req.params.stor_ide);
    if (Number.isInteger(stor_ide) && stor_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                const updatestore = await store_model.findAll({where:{
                        stor_ide 
                    }
                });
                var result = await (store_model.destroy({
                    where: {
                        stor_ide
                    }
                }));
                if (result === 1) {
                    if (updatestore[0].stor_logo !== '') {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatestore[0].stor_logo)); 
                        } catch (e) {
                        }
                    }
                    resolve('Tienda eliminada correctamente')
                } else {
                    resolve('Tienda no encontrada')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación de la tienda')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Tienda inválida")
        })
    }
}

async function listStore(req, res) 
{
    return new Promise(async(resolve) => {
        var result = await(store_model.findAll())
        var count_store = result.length;
        var store = {};
        if (count_store > 0) {
            var stores = []
            for (var i = 0; i < result.length; i++) {
                store = {}
                store.ide = result[i].stor_ide
                store.name = result[i].stor_name
                store.url = result[i].stor_url
                store.typestore = result[i].stor_typestore
                store.userkey = result[i].stor_userkey
                store.secretkey = result[i].stor_secretkey
                store.city = result[i].stor_city
                store.logo = result[i].stor_logo
                store.status = result[i].stor_status
                stores.push(store)
            }
            resolve(stores)
        } else {
            resolve('No hay ninguna tienda para mostrar')
        }
    });
}
async function getStoreById(req, id) 
{
    var stor_ide = parseInt(id);
    if (Number.isInteger(stor_ide) && stor_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (store_model.findAll({ where: { stor_ide:  stor_ide } }))
            var count_store = result.length;
            if (count_store > 0) {
                var result_store = {};
                result_store.ide = result[0].stor_ide;
                result_store.name = result[0].stor_name
                result_store.url = result[0].stor_url
                result_store.typestore = result[0].stor_typestore
                result_store.userkey = result[0].stor_userkey
                result_store.secretkey = result[0].stor_secretkey
                result_store.city = result[0].stor_city
                result_store.logo = result[0].stor_logo
                result_store.status = result[0].stor_status
                resolve(result_store)
            } else {
                resolve('No hay ninguna tienda para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve("Tienda inválida")
        })
    }
}
module.exports.createStore = createStore
module.exports.updateStore = updateStore
module.exports.deleteStore = deleteStore
module.exports.listStore = listStore
module.exports.getStoreById = getStoreById

