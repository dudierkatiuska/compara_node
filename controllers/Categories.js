'use strict'
const category_model = require('../models/category.js'),
    subcategory_model = require('../models/subcategory.js'),
    { checkToken } = require('../config/tokens'),
    general_helpers = require('../config/helpers'),
    path = require('path'),
    route_files = path.join(general_helpers.base_url, '/files/images/category/'),
    route_relative = 'images/category/',
    file_controller = require('fs')

async function createCategory(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helpers.validateParams('category', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const data = {
        "cate_description" : req.body.description,
        "cate_status" : req.body.status,
        "cate_url" : (req.body.url.includes('data:image/'))?req.body.url:''

    } 
    var image = req.body.url
    if (image != undefined && image !== '' && image.includes('data:image/')) {
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = req.body.description,
            route_store = route_files,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.cate_url = route_relative_file
    }
    
    try {
        var result = await(category_model.create(data))
        return 'Categoría creada correctamente'
    } catch (e) {
        try {
            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file)); 
        } catch (e) {
        }
        return e.parent.detail
    } 
}


async function updateCategory(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helpers.validateParams('category', req))
    if (check_request !== 'Correcto') {
        return check_request
    }
    
    var cate_ide = parseInt(req.params.cate_ide);
    var { description, status, url} = req.body;
    if (Number.isInteger(cate_ide) && cate_ide !== '') {
        const updatecategory = await category_model.findAll({
            attributes: ['cate_ide','cate_description', 'cate_status', 'cate_url'],
            where:{
                cate_ide 
            }
        });
        if (updatecategory.length > 0) {
            return new Promise((resolve) => {
                updatecategory.forEach(async category_model => {
                    var image = url
                    if (updatecategory[0].cate_url !== '' && image !== undefined && image !== '' && image.includes('data:image/')) {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatecategory[0].cate_url)); 
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
                        url = route_relative_file
                    }
                    var results = ''
                    try {
                        var result = await (category_model.update({
                                                        cate_description: description,
                                                        cate_status: status,
                                                        cate_url: url
                                                }));
                        results = 'Categoría actualizada correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Categoría no encontrada")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Categoría inválida")
        })
    }
}


async function deleteCategory(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var cate_ide = parseInt(req.params.cate_ide);
    if (Number.isInteger(cate_ide) && cate_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                const updatecategory = await category_model.findAll({where:{
                        cate_ide 
                    }
                });
                var result = await (category_model.destroy({
                    where: {
                        cate_ide
                    }
                }));
                if (result === 1) {
                    if (updatecategory[0].cate_url !== '') {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatecategory[0].cate_url)); 
                        } catch (e) {
                        }
                    }
                    resolve('Categoría eliminada correctamente')
                } else {
                    resolve('Categoría no encontrada')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación de la categoría')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Categoría inválida")
        })
    }
}



async function listCategory(req, res) 
{
    /*var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token == 'Token inválido') {
        return result_token
    }*/
    return new Promise(async(resolve) => {
        var result = await(category_model.findAll())
        var count_category = result.length;
        var category = {};
        if (count_category > 0) {
            var categories = []
            for (var i = 0; i < result.length; i++) {
                category = {}
                category.ide = result[i].cate_ide
                category.description = result[i].cate_description
                category.status = result[i].cate_status
                category.url = result[i].cate_url
                categories.push(category)
            }
            resolve(categories)
        } else {
            resolve('No hay ninguna categoría para mostrar')
        }
    });
}


async function getCategoryById(req, id) 
{
    var cate_ide = parseInt(id);
    if (Number.isInteger(cate_ide) && cate_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (category_model.findAll({ where: { cate_ide:  cate_ide } }))
            var count_category = result.length;
            if (count_category > 0) {
                var result_category = {};
                result_category.ide = result[0].cate_ide;
                result_category.description = result[0].cate_description
                result_category.status = result[0].cate_status
                result_category.url = result[0].cate_url
                var result_subcategory = await (subcategory_model.findAll({ where: { suca_cate: result[0].cate_ide } }))
                result_category.subcategories = {};
                var rec_subcategories = 0
                if (result_subcategory.length > 0) {
                    for (var i = 0; i < result_subcategory.length; i++) {
                        result_category.subcategories[rec_subcategories] = {}
                        result_category.subcategories[rec_subcategories].ide = result_subcategory[i].suca_ide;
                        result_category.subcategories[rec_subcategories].description = result_subcategory[i].suca_description
                        rec_subcategories++
                    }
                }
                resolve(result_category)
            } else {
                resolve('No hay ninguna categoría para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve("Categoría inválida")
        })
    }
}


module.exports.createCategory = createCategory
module.exports.updateCategory = updateCategory
module.exports.deleteCategory = deleteCategory
module.exports.listCategory = listCategory
module.exports.getCategoryById = getCategoryById