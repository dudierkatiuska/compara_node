'use strict'
const product_model = require('../models/product.js'),
    favoriteproduct_model = require('../models/favoriteproduct.js'),
    popularproduct_model = require('../models/popularproduct.js'),
    helpers = require('../config/helpers'),
    Op = require('../config/config').op,
    sequelize = require('../config/config'),
    number_products_pagination = 15,
    number_products_carrucel = 20

async function searchProduct(req, res) 
{
    var key = req.params.key,
        from = req.query.from,
        to = req.query.to,
        tipo = req.query.tipo,
        city = req.query.ciudad,
        new_results = [],
        filters = {}
    key = key.toLowerCase()
    return new Promise(async(resolve) => {
        if (from != undefined && to != undefined) {
            var result = await (product_model.findAll({
                // offset: from,
                // limit: to,
                where:{
                    [Op.or]: {
                        prod_name: {[Op.iLike]: '%' + key + '%'},
                        prod_categories: {[Op.iLike]: '%' + key + '%'}
                    }
                },
                order: [
                ['prod_price', 'ASC']
            ]}))
            var result_all = await (product_model.findAll({
                    where:{
                        [Op.or]: {
                            prod_name: {[Op.iLike]: '%' + key + '%'},
                            prod_categories: {[Op.iLike]: '%' + key + '%'}
                        }
                    },
                    order: [
                    ['prod_price', 'ASC']
                ]})),
                new_results = result,
                count_prod = result_all.length
        } else {
            var result = await (product_model.findAll({
                where:{
                    [Op.or]: {
                        prod_name: {[Op.iLike]: '%' + key + '%'},
                        prod_categories: {[Op.iLike]: '%' + key + '%'}
                    }
                },
                order: [
                ['prod_price', 'ASC']
            ]})),
                new_results = result,
                count_prod = new_results.length
        }
        var products = []
        if (count_prod > 0) {
            var new_results = new_results.filter(function(value, index, new_results){
                var attributes_object = Object.keys(JSON.parse((value.prod_attribute).replace(/\'/gi,'\"')))
                var attributes = Object.values(JSON.parse((value.prod_attribute).replace(/\'/gi,'\"')))

                var object_attributes = JSON.parse(value.prod_attribute.replace(/\'/gi,'\"'))
                for (var i in object_attributes) {
                    if (filters[`${i}`] == undefined) {
                        filters[`${i}`] = []
                    }
                    var values = object_attributes[i].split(',')
                    for (var j in values) {
                        filters[`${i}`].push(values[j])
                    }
                }

                var result = attributes.map(function(value_attribute, index, new_results){
                                            if (tipo == undefined) {
                                                return value_attribute
                                            } else if (tipo != undefined) {
                                                var aux_value = value_attribute.toLowerCase(),
                                                    aux_tipo = tipo.toLowerCase()
                                                if ((aux_value).includes(aux_tipo)) {
                                                    return value_attribute
                                                }
                                            }
                                        }).reduce(function(prev, next, value){
                                            if (prev != undefined) {
                                                return prev
                                            } else if (next != undefined) {
                                                return next
                                            }
                                        })
                var result_city = attributes.map(function(value_attribute, index, new_results){
                                            if (city == undefined) {
                                                return value_attribute
                                            } else if (city != undefined) {
                                                var aux_value = value_attribute.toLowerCase(),
                                                    aux_city = city.toLowerCase()
                                                if ((aux_value).includes(aux_city)) {
                                                    return value_attribute
                                                }
                                            }
                                        }).reduce(function(prev, next, value){
                                            if (prev != undefined) {
                                                return prev
                                            } else if (next != undefined) {
                                                return next
                                            }
                                        })                    
                if (result != undefined && result_city != undefined) {
                    return value
                } else {
                    return null
                }
            })
            count_prod = new_results.length
            var date = new Date(),
                date_reg = (date.getMonth() +1) + "/" + date.getDate() + "/" + date.getFullYear()
            var _data = {
                "popr_description": key,
                "popr_count": 1,
                "popr_date": date_reg
            }
            var result_popular = await (popularproduct_model.findAll({})),
                result_popular_to_update = [],
                band_popular = false
            if (result_popular.length > 0) {
                for (var i in result_popular) {
                    if ((result_popular[i].popr_description).toLowerCase() == key.toLowerCase()) {
                        band_popular = true
                        result_popular_to_update.push(result_popular[i])
                        _data.popr_description = result_popular[i].popr_description
                        _data.popr_count = parseInt(result_popular[i].popr_count) + 1
                        _data.popr_date = result_popular[i].popr_date
                    }
                }
            }
            if (band_popular) {
                var results = ''
                result_popular_to_update.forEach(async popularproduct_model => {
                    try {
                        var result = await (popularproduct_model.update(_data));
                        results = 'Se actualizó la búsqueda popular correctamente'
                    } catch (e) {
                        results = e.parent.detail
                    }
                })
            } else {
                var result_create_popular = await(popularproduct_model.create(_data))
            }
            products = new_results.map(function(value, index, new_results){
                var aux = {}
                aux.ide = value.prod_ide
                aux.name = value.prod_name
                aux.price = value.prod_price
                aux.permalink = value.prod_link
                aux.src = value.prod_src
                aux.url = value.prod_url
                aux.categories = value.prod_categories
                aux.attribute = value.prod_attribute
                aux.logo = value.prod_logo
                return aux
            })
            var result = {}
            if (from != undefined && to != undefined) {
                result.products = products.slice(from, to)
            } else {
                result.products = products
            }
            result.count = count_prod
            
            for (var i in filters) {
                filters[i] = [...new Set(filters[i])]
                var aux = filters[i]
                filters[i] = {}
                filters[i].key = i
                filters[i].values = aux
                filters[i].values.push('Todos')
                if (aux.length >= 10) {
                    filters[i].type = 'typeA'
                } else if (aux.length < 10) {
                    filters[i].type = 'typeB'
                }
            }
            filters = Object.values(filters)
            result.filters = filters
            resolve(result)
        } else {
            resolve('No hay ningún producto para mostrar')
        }
    })
}

async function getTopSearches(req, res) 
{
    return new Promise(async (resolve) => {
        var result = [],
            new_results = [],
            limit_searches = 7

        result = await (popularproduct_model.findAll({
            order: [
                ['popr_count', 'DESC']
        ]}))
        if (result.length > limit_searches) {
            for (var i = 0; i < limit_searches; i++) {
                new_results.push(result[i])
            }
            resolve(new_results)
        } else if (result.length < (limit_searches + 1)) {
            resolve(result)
        } else if (result.length == 0) {
            resolve('No hay ninguna búsqueda para mostrar')
        }
    })
}

async function filterBy(req, res) 
{
    return new Promise(async (resolve) => {
        var type = req.query.tipo,
            brand = req.query.marca,
            measures = req.query.medidas,
            color = req.query.color,
            city = req.query.ciudad,
            from = req.query.from,
            to = req.query.to,
            key = req.params.key,
            new_results = []
        var result = await (product_model.findAll({
            where:{
                [Op.or]: {
                    prod_name: {[Op.iLike]: '%' + key + '%'},
                    prod_categories: {[Op.iLike]: '%' + key + '%'},
                }
            },
            order: [
            ['prod_price', 'ASC']
        ]}))
        if (result.length > 0) {
            new_results = result
            var new_results = new_results.filter(function(value, index, new_results){
                var attributes_object = Object.keys(JSON.parse((value.prod_attribute).replace(/\'/gi,'\"')))
                var attributes = Object.values(JSON.parse((value.prod_attribute).replace(/\'/gi,'\"')))
                var result_type = attributes.map(function(value_attribute, index, new_results){
                                            if (type == undefined) {
                                                return value_attribute
                                            } else if (type != undefined) {
                                                var aux_value = value_attribute.toLowerCase(),
                                                    aux_type = type.toLowerCase()
                                                if ((aux_value).includes(aux_type) || aux_type == 'todos') {
                                                    return value_attribute
                                                }
                                            }
                                        }).reduce(function(prev, next, value){
                                            if (prev != undefined) {
                                                return prev
                                            } else if (next != undefined) {
                                                return next
                                            }
                                        })
                var result_brand = attributes.map(function(value_attribute, index, new_results){
                                            if (brand == undefined) {
                                                return value_attribute
                                            } else if (brand != undefined) {
                                                var aux_value = value_attribute.toLowerCase(),
                                                    aux_brand = brand.toLowerCase()
                                                if ((aux_value).includes(aux_brand) || aux_brand == 'todos') {
                                                    return value_attribute
                                                }
                                            }
                                        }).reduce(function(prev, next, value){
                                            if (prev != undefined) {
                                                return prev
                                            } else if (next != undefined) {
                                                return next
                                            }
                                        })
                var result_measures = attributes.map(function(value_attribute, index, new_results){
                                            if (measures == undefined) {
                                                return value_attribute
                                            } else if (measures != undefined) {
                                                var aux_value = value_attribute.toLowerCase(),
                                                    aux_measures = measures.toLowerCase()
                                                if ((aux_value).includes(aux_measures) || aux_measures == 'todos') {
                                                    return value_attribute
                                                }
                                            }
                                        }).reduce(function(prev, next, value){
                                            if (prev != undefined) {
                                                return prev
                                            } else if (next != undefined) {
                                                return next
                                            }
                                        })
                var result_color = attributes.map(function(value_attribute, index, new_results){
                                            if (color == undefined) {
                                                return value_attribute
                                            } else if (color != undefined) {
                                                var aux_value = value_attribute.toLowerCase(),
                                                    aux_color = color.toLowerCase()
                                                if ((aux_value).includes(aux_color) || aux_color == 'todos') {
                                                    return value_attribute
                                                }
                                            }
                                        }).reduce(function(prev, next, value){
                                            if (prev != undefined) {
                                                return prev
                                            } else if (next != undefined) {
                                                return next
                                            }
                                        })
                var result_city = attributes.map(function(value_attribute, index, new_results){
                                            if (city == undefined) {
                                                return value_attribute
                                            } else if (city != undefined) {
                                                var aux_value = value_attribute.toLowerCase(),
                                                    aux_city = city.toLowerCase()
                                                if ((aux_value).includes(aux_city) || aux_city == 'todos') {
                                                    return value_attribute
                                                }
                                            }
                                        }).reduce(function(prev, next, value){
                                            if (prev != undefined) {
                                                return prev
                                            } else if (next != undefined) {
                                                return next
                                            }
                                        })                    
                if (result_type != undefined && result_brand != undefined && result_measures != undefined && result_color != undefined && result_city != undefined) {
                    return value
                } else {
                    return null
                }
            })
            count_prod = new_results.length
            new_results = helpers.removeDuplicates(new_results)
            var count_prod = new_results.length
            if (from != undefined && to != undefined) {
                new_results = new_results.slice(from)
                new_results = new_results.slice(0, to)
            }
            var result = {}
            new_results = new_results.map(function(value, index, new_results){
                var aux = {}
                aux.ide = value.prod_ide
                aux.name = value.prod_name
                aux.price = value.prod_price
                aux.permalink = value.prod_link
                aux.src = value.prod_src
                aux.url = value.prod_url
                aux.categories = value.prod_categories
                aux.attribute = value.prod_attribute
                aux.logo = value.prod_logo
                return aux
            })
            result.products = new_results
            result.count = count_prod
            resolve(result)
        } else {
            resolve('No hay ningún producto para mostrar')
        }
    })
}

async function productHomePage(req, res) 
{
    var key = req.params.key,
        from = req.query.from,
        to = req.query.to,
        new_results = []
    key = key.toLowerCase()
    return new Promise(async(resolve) => {
        if (from != undefined && to != undefined) {
            var result = await (product_model.findAll({
                offset: from,
                limit: to,
                where:{
                    [Op.or]: {
                        prod_name: {[Op.iLike]: '%' + key + '%'},
                        prod_categories: {[Op.iLike]: '%' + key + '%'},
                    }
                    // prod_name: {[Op.iLike]: '%' + key + '%'}
                },
                order: [
                ['prod_price', 'ASC']
            ]}))
            var result_all = await (product_model.findAll({
                    where:{
                        [Op.or]: {
                            prod_name: {[Op.iLike]: '%' + key + '%'},
                            prod_categories: {[Op.iLike]: '%' + key + '%'},
                        }
                        // prod_name: {[Op.iLike]: '%' + key + '%'}
                    },
                    order: [
                    ['prod_price', 'ASC']
                ]})),
                new_results = result,
                count_prod = result_all.length
        } else {
            var result = await (product_model.findAll({
                where:{
                    [Op.or]: {
                        prod_name: {[Op.iLike]: '%' + key + '%'},
                        prod_categories: {[Op.iLike]: '%' + key + '%'},
                    }
                    // prod_name: {[Op.iLike]: '%' + key + '%'}
                },
                order: [
                ['prod_price', 'ASC']
            ]})),
                new_results = result,
                count_prod = result.length
        }
        var products = []
        if (count_prod > 0) {
            for (var i in new_results) {
                products[i] = {};
                products[i].ide = new_results[i].prod_ide
                products[i].name = new_results[i].prod_name
                products[i].price = new_results[i].prod_price
                products[i].permalink = new_results[i].prod_link
                products[i].src = new_results[i].prod_src
                products[i].url = new_results[i].prod_url
                products[i].categories = new_results[i].prod_categories
                products[i].attribute = new_results[i].prod_attribute
                products[i].logo = new_results[i].prod_logo

            }
            var result = {}
            result.products = products
            result.count = count_prod
            resolve(result)
        } else {
            resolve('No hay ningún producto para mostrar')
        }
    })
}

module.exports.searchProduct = searchProduct
module.exports.getTopSearches = getTopSearches
module.exports.filterBy = filterBy
module.exports.productHomePage = productHomePage