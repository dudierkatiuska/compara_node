'use strict'
const permissioncrud_model = require('../models/permissioncrud.js'),
    general_helper = require('../config/helpers'),
    encryption = require('../config/encryption'),
    { checkToken } = require('../config/tokens'),
    path = require('path'),
    route_files = path.join(general_helper.base_url, '/files/images/icons/'),
    route_relative = 'images/icons/',
    file_controller = require('fs')

async function createPermissioncrud(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var check_request = await(general_helper.validateParams('permissioncrud', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const data = {
        "pecr_description" : req.body.description,
        "pecr_url" : req.body.url,
        "pecr_icon" : (req.body.icon.includes('data:image/'))?req.body.icon:''
    }
    var image = req.body.icon
    if (image != undefined && image !== '' && image.includes('data:image/')) {
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = req.body.description,
            route_store = route_files,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.pecr_icon = route_relative_file
    }
    
    try {
        var result = await(permissioncrud_model.create(data))
        return 'Permiso crud creado correctamente'
    } catch (e) {
        try {
            file_controller.unlinkSync(path.join(general_helper.base_url, '/files/' + route_relative_file)); 
        } catch (e) {
        }
        return e.parent.detail
    } 
}

async function updatePermissioncrud(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helper.validateParams('permissioncrud', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    var pecr_ide = parseInt(req.params.pecr_ide);
    if (Number.isInteger(pecr_ide) && pecr_ide !== '') {
        const { description, url, icon} = req.body;
        const updatepermissioncrud = await permissioncrud_model.findAll({
            attributes: ['pecr_ide','pecr_description', 'pecr_url','pecr_icon'],
            where:{
            pecr_ide 
            }
        });
        if(updatepermissioncrud.length > 0){
            return new Promise((resolve) => {
                updatepermissioncrud.forEach(async permissioncrud_model => {
                    var image = icon
                    if (updatepermissioncrud[0].pecr_icon !== '' && image !== undefined && image !== '' && image.includes('data:image/')) {
                        try {
                            file_controller.unlinkSync(path.join(general_helper.base_url, '/files/' + updatepermissioncrud[0].pecr_icon)); 
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
                        icon = route_relative_file
                    }
                    var results = ''
                    try {
                        var result = await (permissioncrud_model.update({
                                                            pecr_description: description,
                                                            pecr_url: url,
                                                            pecr_icon: icon
                                                }));
                        results = 'Permiso crud actualizado correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve('Permiso crud no encontrado')
            })
        }  
    } else {
        return new Promise((resolve) => {
            resolve('Permiso crud inválido')
        })
    }       
}

async function deletePermissioncrud(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var pecr_ide = parseInt(req.params.pecr_ide);
    if (Number.isInteger(pecr_ide) && pecr_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                var result = await (permissioncrud_model.destroy({
                    where: {
                        pecr_ide
                    }
                }));
                if (result === 1) {
                    if (updatepermissioncrud[0].cate_url !== '') {
                        try {
                            file_controller.unlinkSync(path.join(general_helper.base_url, '/files/' + updatepermissioncrud[0].pecr_icon)); 
                        } catch (e) {
                        }
                    }
                    resolve('Permiso crud eliminado correctamente')
                } else {
                    resolve('Permiso crud no encontrado')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación del permiso crud')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve('Permiso crud inválido')
        })
    }  
}

async function listPermissioncrud(req, res) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    return new Promise(async(resolve) => {
        var result = await(permissioncrud_model.findAll())
        var count_permissioncrud = result.length;
        var permissioncrud= {};
        if (count_permissioncrud > 0) {
            var permissions = []
            for (var i = 0; i < result.length; i++) {
                permissioncrud = {};
                permissioncrud.ide = result[i].pecr_ide;
                permissioncrud.description = result[i].pecr_description;
                permissioncrud.url = result[i].pecr_url;
                permissioncrud.icon = result[i].pecr_icon;
                permissions.push(permissioncrud)
            }
            resolve(permissions)
        } else {
            resolve('No hay ningún permiso crud para mostrar')
        }
    });
}


async function getPermissioncrudById(req, id) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var pecr_ide = parseInt(id);
    if (Number.isInteger(pecr_ide) && pecr_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (permissioncrud_model.findAll({ where: { pecr_ide:  pecr_ide } }))
            var count_permissioncrud = result.length;
            if (count_permissioncrud > 0) {
                var result_permissioncrud = {};
                result_permissioncrud.ide = result[0].pecr_ide;
                result_permissioncrud.description = result[0].pecr_description;
                result_permissioncrud.url = result[0].pecr_url;
                result_permissioncrud.icon = result[0].pecr_icon;
                resolve(result_permissioncrud)
            } else {
                resolve('No hay ningún permiso crud para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve('Permiso crud inválido')
        })
    } 
}

module.exports.createPermissioncrud = createPermissioncrud
module.exports.updatePermissioncrud = updatePermissioncrud
module.exports.deletePermissioncrud = deletePermissioncrud
module.exports.listPermissioncrud = listPermissioncrud
module.exports.getPermissioncrudById = getPermissioncrudById