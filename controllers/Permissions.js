'use strict'
const permission_model = require('../models/permission.js'),
    permissioncrud_model = require('../models/permissioncrud.js'),
    submodule_model = require('../models/submodule.js'),
    { checkToken } = require('../config/tokens'),
    general_helper = require('../config/helpers')

async function createPermission(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var check_request = await(general_helper.validateParams('permission', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const data = {
        "perm_actu" : req.body.actu,
        "perm_sumo" : req.body.sumo,
        "perm_pecr" : req.body.pecr,
        "perm_status" : req.body.status,
    }
    try{
        var result = await(permission_model.create(data))
        return 'Permiso actualizado correctamente'
    } catch (e) {
        return e.parent.detail
    }
}


async function updatePermission(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helper.validateParams('permission', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    var perm_ide = req.params.perm_ide;
    const { actu, sumo, pecr, status} = req.body;
    const updatepermission = await permission_model.findAll({
        attributes: ['perm_ide','perm_actu', 'perm_sumo','perm_pecr','perm_status'],
        where:{
           perm_ide 
        }
    });
    if(updatepermission.length > 0){
        return new Promise((resolve) => {
            updatepermission.forEach(async permission_model => {
                var results = ''
                try {
                    var result = await (permission_model.update({
                                                        perm_actu: actu,
                                                        perm_sumo: sumo,
                                                        perm_pecr: pecr,
                                                        perm_status: status
                                            }));
                    results = 'Permiso actualizado correctamente';
                } catch (e) {
                    results = e.parent.detail;
                }
                resolve(results)
            })
        })
    } else {
        return new Promise((resolve) => {
            resolve("Permiso no encontrado")
        })
    }
}

async function deletePermission(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
        
    var perm_ide = parseInt(req.params.perm_ide);
    if (Number.isInteger(perm_ide) && perm_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                var result = await (permission_model.destroy({
                    where: {
                        perm_ide
                    }
                }));
                if (result === 1) {
                    resolve('Permiso eliminado correctamente')
                } else {
                    resolve('Permiso no encontrado')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación del permiso')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Permiso inválido")
        })
    }
}


async function listPermission(req, res) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    return new Promise(async(resolve) => {
        var result = await (permission_model.findAll())
        var permission = {};
        var count_permission = result.length;
        if (count_permission > 0) {
            var permissions = []
            for (var i = 0; i < result.length; i++) {
                var result_permission = await (permissioncrud_model.findAll({ where: { pecr_ide: result[i].perm_pecr } }))
                var result_submodule = await (submodule_model.findAll({ where: { sumo_ide: result[i].perm_sumo } }))
                permission = {};
                permission.ide = result[i].perm_ide;
                permission.actu = result[i].perm_actu;
                permission.sumo = result[i].perm_sumo;
                permission.pecr = result[i].perm_pecr;
                permission.status = result[i].perm_status;
                permissions.push(permission)
            }
            resolve(permissions)
        } else {
            resolve('No hay ningún permiso para mostrar')
        }   
    })
}


async function getPermissionById(req, id) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var perm_ide = id;
    return new Promise(async(resolve) => {
        var result = await (permission_model.findAll({ where: { perm_ide:  perm_ide } }))
        var count_permission = result.length;
        if (count_permission > 0) {
            var result_permission = {};
            result_permission.ide = result[0].perm_ide;
            result_permission.actu = result[0].perm_actu;
            result_permission.sumo = result[0].perm_sumo;
            result_permission.pecr = result[0].perm_pecr;
            result_permission.status = result[0].perm_status;
            resolve(result_permission)
            resolve(result)
        } else {
            resolve('No hay ningún permiso para mostrar')
        }
        return result
    })
}

module.exports.createPermission = createPermission
module.exports.updatePermission = updatePermission
module.exports.deletePermission = deletePermission
module.exports.listPermission = listPermission
module.exports.getPermissionById = getPermissionById