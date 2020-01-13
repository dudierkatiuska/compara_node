'use strict'
const encryption = require('../config/encryption'),
    general_helpers = require('../config/helpers'),
    category_model = require('../models/category'),
    usertype_model = require('../models/usertype'),
    files = require('fs'),
    path = require('path'),
    params = require('./params'),
    categories = params.categories,
    type_users = params.type_users,
    route_files_category = path.join(general_helpers.base_url, '/files/images/category/'),
    route_relative_category = 'images/category/'

async function loadScripts()
{
    var count_errors = 0,
        count_inserts = 0
    var result_categories = categories
    for (var i = 0; i < result_categories.length; i++) {

        var data = {
            "cate_description" : result_categories[i].description,
            "cate_url" : '',
            "cate_status" : result_categories[i].status,
        }

        var image = result_categories[i].image
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = result_categories[i].description,
            route_store = route_files_category,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative_category + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.cate_url = route_relative_file
        
        try {
            var result_insert = await(category_model.create(data))
            console.log("Categoría ", result_categories[i].description, " insertada correctamente")
            count_inserts++
        } catch (e) {
            console.log("Error: ", e)
            count_errors++
        }
    }

    var result_type_users = type_users
    for (var i = 0; i < result_type_users.length; i++) {

        var data = {
            "usty_description" : result_type_users[i].description,
            "usty_status" : result_type_users[i].status,
        }

        try {
            var result_insert = await(usertype_model.create(data))
            console.log("Tipo de usuario ", result_type_users[i].description, " creado correctamente")
            count_inserts++
        } catch (e) {
            console.log("Error: ", e)
            count_errors++
        }
    }
    if (count_errors === 0) {
        return 'Script ejecutado correctamente' 
    } else {
        return 'Hubo errores en la ejecución del script'
    }
    
}

module.exports.loadScripts = loadScripts