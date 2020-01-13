'use strict'
const subcategory_model = require('../models/subcategory.js'),
    category_model = require('../models/category.js'),
    encryption = require('../config/encryption'),
    general_helpers = require('../config/helpers'),
    { checkToken } = require('../config/tokens')


async function createSubcategory(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var check_request = await(general_helpers.validateParams('subcategory', req))
        if (check_request !== 'Correcto') {
            return check_request
    }
    const data = {
        "suca_description" : req.body.description,
        "suca_cate" : req.body.category,
        "suca_status" : req.body.status
    }
    
    try {
        var result = await(subcategory_model.create(data))
        return 'Subcategoría creada correctamente'
    } catch (e) {
        try { 
        } catch (e) {
        }
        return e.parent.detail
    } 
}


async function updateSubcategory(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var check_request = await(general_helpers.validateParams('subcategory', req))
        if (check_request !== 'Correcto') {
            return check_request
    }

    var suca_ide = parseInt(req.params.suca_ide);
    var {  description, category, status } = req.body;
    if (Number.isInteger(suca_ide) && suca_ide !== '') {
        const updatesubcategory = await subcategory_model.findAll({
            attributes: ['suca_ide','suca_description','suca_cate', 'suca_status'],
            where:{
                suca_ide 
            }
        });
        if (updatesubcategory.length > 0) {
            return new Promise((resolve) => {
                updatesubcategory.forEach(async subcategory_model => {
                    var results = ''
                    try {
                        var result = await (subcategory_model.update({
                                                        suca_description: description,
                                                        suca_cate: category,
                                                        suca_status: status
                                                }));
                        results = 'Subcategoría actualizada correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Subcategoría no encontrada")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Subcategoría inválida")
        })
    }
}

async function deleteSubcategory(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var suca_ide = parseInt(req.params.suca_ide);
    if (Number.isInteger(suca_ide) && suca_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                const updatesubcategory = await subcategory_model.findAll({where:{
                        suca_ide 
                    }
                });
                var result = await (subcategory_model.destroy({
                    where: {
                        suca_ide
                    }
                }));
                if (result === 1) {
                    resolve('Subcategoría eliminada correctamente')
                } else {
                    resolve('Subcategoría no encontrada')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación de la subcategoría')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Subcategoría inválida")
        })
    }
}

async function listSubcategory(req, res) 
{
    // var token = req.headers.authentication
    // var result_token = await(checkToken(token))
    // if (result_token == 'Token inválido') {
    //     return result_token
    // }

    return new Promise(async(resolve) => {
        var result = await (subcategory_model.findAll())
        var subcategory = {};
        var count_subcategories = result.length;
        if (count_subcategories > 0) {
            var subcategories = []
            for (var i = 0; i < result.length; i++) {
                var result_category = await (category_model.findAll({ where: { cate_ide: result[i].suca_cate } }))
                subcategory = {};
                subcategory.ide = result[i].suca_ide;
                subcategory.description = result[i].suca_description;
                subcategory.cate = result[i].suca_cate;
                subcategories[i].status = result[i].suca_status;
                subcategory.category = {};
                subcategory.category.description = result_category[0].cate_description;
                subcategories.push(subcategory)
            }
            resolve(subcategories)
        } else {
            resolve('No hay ninguna subcategoría para mostrar')
        }   
    })
}

async function getSubcategoryById(req, id) 
{
    // var token = req.headers.authentication
    // var result_token = await(checkToken(token))
    // if (result_token == 'Token inválido') {
    //     return result_token
    // }

    var suca_ide = id;
    return new Promise(async(resolve) => {
        var result = await (subcategory_model.findAll({ where: { suca_ide:  suca_ide } }))
        var count_subcategory = result.length;
        if (count_subcategory > 0) {
            var result_subcategory = {};
            result_subcategory.ide = result[0].suca_ide;
            result_subcategory.description = result[0].suca_description;
            result_subcategory.cate = result[0].suca_cate;
            result_subcategory.status = result[0].suca_status;
            resolve(result_subcategory)
        } else {
            resolve('No hay ninguna subcategoría para mostrar')
        }
        return result
    })
}

module.exports.createSubcategory = createSubcategory
module.exports.updateSubcategory = updateSubcategory
module.exports.deleteSubcategory = deleteSubcategory
module.exports.listSubcategory = listSubcategory
module.exports.getSubcategoryById = getSubcategoryById