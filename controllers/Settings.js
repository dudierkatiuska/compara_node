'use strict'
const setting_model = require('../models/setting.js'),
    { checkToken } = require('../config/tokens'),
    general_helpers = require('../config/helpers'),
    path = require('path'),
    route_files = path.join(general_helpers.base_url, '/files/images/logo/'),
    route_relative = 'images/logo/',
    route_files_one = path.join(general_helpers.base_url, '/files/images/promotion/'),
    route_relative_one = 'images/promotion/',
    route_relative_one_images = [],
    route_files_four = path.join(general_helpers.base_url, '/files/images/how_buy/'),
    route_relative_four = 'images/how_buy/',
    route_relative_four_images = [],
    route_files_five = path.join(general_helpers.base_url, '/files/images/app/'),
    route_relative_five = 'images/app/',
    route_relative_five_images = [],
    route_files_banner = path.join(general_helpers.base_url, '/files/images/banner/'),
    route_relative_banner = 'images/banner/',
    file_controller = require('fs')


async function createSetting(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var check_request = await(general_helpers.validateParams('settings', req))
    if (check_request !== 'Correcto') {
        return check_request
    }
    var sections_one = req.body.section_one
    var sections_four = req.body.section_four
    var sections_five = req.body.section_five
    
    const data = {
        "sett_logo" : (req.body.logo.includes('data:image/'))?req.body.logo:'',
        "sett_sect1" : '',
        "sett_sect2" : req.body.section_two,
        "sett_sect3" : req.body.section_three,
        "sett_sect4" : '',
        "sett_sect5" : '',
        "sett_banner": (req.body.banner.includes('data:image/'))?req.body.banner:''
    }
    var image = req.body.logo
    if (image != undefined && image !== '' && image.includes('data:image/')) {
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = 'logo',
            route_store = route_files,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.sett_logo = route_relative_file
    }
    var banner = req.body.banner
    if (banner != undefined && banner != '') {
        var ba64 = require('ba64'),
            route_relative_file_banner = '',
            base64Data = banner.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
            route_store = route_files_banner,
            fullname_file = route_store + '' + name_file
            route_relative_file_banner =  route_relative_banner + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.sett_banner = route_relative_file_banner
    }
    var images_section_one = ['promo1', 'promo2', 'promo3', 'promo4']
    for (let h = 0; h < images_section_one.length; h++) {
        for (var k in sections_one) {
            if (k == images_section_one[h] && sections_one[k] != '' && sections_one[k].includes('data:image')) {
                var ba64 = require('ba64'),
                    route_relative_file_one = '',
                    base64Data = sections_one[k].replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                    name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                    route_store = route_files_one,
                    fullname_file = route_store + '' + name_file
                    route_relative_file_one =  route_relative_one + name_file + '.jpeg'
                ba64.writeImageSync(fullname_file, base64Data)
                sections_one[k] = route_relative_file_one
                route_relative_one_images.push(route_relative_file_one)
            }
        }
    }
    data.sett_sect1 = JSON.stringify(sections_one)

    for (let i = 1; i <= 3; i++) {
        if (sections_four['image' + i] != '' && sections_four['image' + i].includes('data:image')) {
            var ba64 = require('ba64'),
                route_relative_file_four = '',
                base64Data = sections_four['image' + i].replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                route_store = route_files_four,
                fullname_file = route_store + '' + name_file
                route_relative_file_four =  route_relative_four + name_file + '.jpeg'
            ba64.writeImageSync(fullname_file, base64Data)
            sections_four['image' + i] = route_relative_file_four
            route_relative_four_images.push(route_relative_file_four)
        }
    }
    data.sett_sect4 = JSON.stringify(sections_four)

    var images_section_five = ['icon', 'image_googleplay', 'image_appstore', 'image_fondo', 'image']
    for (let j = 0; j < images_section_five.length; j++) {
        for (var k in sections_five) {
            if (k == images_section_five[j] && sections_five[k] != '' && sections_five[k].includes('data:image')) {
                var ba64 = require('ba64'),
                    route_relative_file_five = '',
                    base64Data = sections_five[k].replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                    name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                    route_store = route_files_five,
                    fullname_file = route_store + '' + name_file
                    route_relative_file_five =  route_relative_five + name_file + '.jpeg'
                ba64.writeImageSync(fullname_file, base64Data)
                sections_five[k] = route_relative_file_five
                route_relative_five_images.push(route_relative_file_five)
            }
        }
    }
    data.sett_sect5 = JSON.stringify(sections_five)
    try {
        var result = await(setting_model.create(data))
        return 'Configuración creada correctamente'
    } catch (e) {
        try {
            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file)); 
            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file_banner)); 
            for (var h = 0; h < route_relative_one_images.length; h++) {
                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_one_images[h])); 
            }
            for (var i = 0; i < route_relative_four_images.length; i++) {
                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_four_images[i])); 
            }
            for (var i = 0; i < route_relative_five_images.length; i++) {
                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_five_images[i])); 
            }

        } catch (e) {
        }
        return e.parent.detail
    } 
}

async function updateSetting(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token == 'Token inválido') {
        return result_token
    }
    var city = general_helper.json2array(req.body.city)
    var sett_ide = parseInt(req.params.sett_ide);
    var { logo, statsection_one, section_two, section_three, section_four, section_five, banner} = req.body;
    if (Number.isInteger(sett_ide) && sett_ide !== '') {
        const updatesetting = await setting_model.findAll({
            attributes: ['sett_ide','sett_logo', 'sett_sect1', 'sett_sect2', 'sett_sect3', 'sett_sect4', 'sett_sect5', 'sett_banner'],
            where:{
            sett_ide 
            }
        });
        if(updatesetting.length > 0){
            return new Promise((resolve) => {
                updatesetting.forEach(async setting_model => {
                    var results = ''
                    try {
                        if (updatesetting[0].sett_logo != '' && logo != undefined && logo != '') {
                            try {
                                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatesetting[0].sett_logo)); 
                            } catch (e) {
                            }
                        }
                        if (logo != undefined && logo != '') {
                            var ba64 = require('ba64'),
                                route_relative_file = '',
                                base64Data = logo.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                                name_file = 'logo',
                                route_store = route_files,
                                fullname_file = route_store + '' + name_file
                                route_relative_file =  route_relative + name_file + '.jpeg'
                            ba64.writeImageSync(fullname_file, base64Data)
                        }
                        if (updatesetting[0].sett_banner != '' && banner != undefined && banner != '') {
                            try {
                                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatesetting[0].sett_banner)); 
                            } catch (e) {
                            }
                        }
                        if (banner != undefined && banner != '') {
                            var ba64 = require('ba64'),
                                route_relative_file_banner = '',
                                base64Data = banner.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                                name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                                route_store = route_files_banner,
                                fullname_file = route_store + '' + name_file
                                route_relative_file_banner =  route_relative_banner + name_file + '.jpeg'
                            ba64.writeImageSync(fullname_file, base64Data)
                        }
                        var section_one = JSON.parse(updatesetting[0].sett_sect1)
                        var images_section_one = ['promo1', 'promo2', 'promo3', 'promo4']
                        for (var k in section_one) {
                            for (let j = 0; j < images_section_one.length; j++) {
                                if (k == images_section_one[j] && section_one[k] != '') {
                                    try {
                                        file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + section_one[k]));
                                    } catch (e) {
                                    }
                                }
                            }
                        }
                        var section_one = req.body.section_one
                        for (let j = 0; j < images_section_one.length; j++) {
                            for (var k in section_one) {
                                if (k == images_section_one[j] && section_one[k] != '' && section_one[k].includes('data:image')) {
                                    var ba64 = require('ba64'),
                                        route_relative_file_one = '',
                                        base64Data = section_one[k].replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                                        name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                                        route_store = route_files_one,
                                        fullname_file = route_store + '' + name_file
                                        route_relative_file_one =  route_relative_one + name_file + '.jpeg'
                                    ba64.writeImageSync(fullname_file, base64Data)
                                    section_one[k] = route_relative_file_one
                                    route_relative_one_images.push(route_relative_file_one)
                                }
                            }
                        }

                        var section_four = JSON.parse(updatesetting[0].sett_sect4)
                        for (var i = 1; i <= 3; i++) {
                            if (section_four['image' + i] != '') {
                                try {
                                    file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + section_four['image' + i]));
                                } catch (e) {
                                }
                            }
                        }
                        var section_four = req.body.section_four
                        for (let i = 1; i <= 3; i++) {
                            if (section_four['image' + i] != '' && section_four['image' + i].includes('data:image')) {
                                var ba64 = require('ba64'),
                                    route_relative_file_four = '',
                                    base64Data = section_four['image' + i].replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                                    name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                                    route_store = route_files_four,
                                    fullname_file = route_store + '' + name_file
                                    route_relative_file_four =  route_relative_four + name_file + '.jpeg'
                                ba64.writeImageSync(fullname_file, base64Data)
                                section_four['image' + i] = route_relative_file_four
                                route_relative_four_images.push(route_relative_file_four)
                            }
                        }
                        var section_five = JSON.parse(updatesetting[0].sett_sect5)
                        var images_section_five = ['icon', 'image_googleplay', 'image_appstore', 'image_fondo', 'image']
                        for (var k in section_five) {
                            for (let j = 0; j < images_section_five.length; j++) {
                                if (k == images_section_five[j] && section_five[k] != '') {
                                    try {
                                        file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + section_five[k]));
                                    } catch (e) {
                                    }
                                }
                            }
                        }
                        var section_five = req.body.section_five
                        for (let j = 0; j < images_section_five.length; j++) {
                            for (var k in section_five) {
                                if (k == images_section_five[j] && section_five[k] != '' && section_five[k].includes('data:image')) {
                                    var ba64 = require('ba64'),
                                        route_relative_file_five = '',
                                        base64Data = section_five[k].replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                                        name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                                        route_store = route_files_five,
                                        fullname_file = route_store + '' + name_file
                                        route_relative_file_five =  route_relative_five + name_file + '.jpeg'
                                    ba64.writeImageSync(fullname_file, base64Data)
                                    section_five[k] = route_relative_file_five
                                    route_relative_five_images.push(route_relative_file_five)
                                }
                            }
                        }
                        var result = await (setting_model.update({
                                                        sett_logo: route_relative_file,
                                                        sett_sect1: JSON.stringify(section_one),
                                                        sett_sect2: section_two,
                                                        sett_sect3: section_three,
                                                        sett_sect4: JSON.stringify(section_four),
                                                        sett_sect5: JSON.stringify(section_five),
                                                        sett_banner: route_relative_file_banner

                                                }));
                        results = 'Configuración actualizada correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Configuración no encontrada")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Configuración inválida")
        })
    }
}

async function deleteSetting(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var sett_ide = parseInt(req.params.sett_ide);
    if (Number.isInteger(sett_ide) && sett_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                const updatesetting = await setting_model.findAll({where:{
                        sett_ide 
                    }
                });
                var result = await (setting_model.destroy({
                    where: {
                        sett_ide
                    }
                }));
                if (result === 1) {
                    if (updatesetting[0].sett_logo != '') {
                        file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatesetting[0].sett_logo));
                    }
                    if (updatesetting[0].sett_banner != '') {
                        file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatesetting[0].sett_banner));
                    }
                    var section_one = JSON.parse(updatesetting[0].sett_sect1)
                    var images_section_one = ['promo1', 'promo2', 'promo3', 'promo4']
                    for (var k in section_one) {
                        for (let j = 0; j < images_section_one.length; j++) {
                            if (k == images_section_one[j] && section_one[k] != '') {
                                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + section_one[k]));
                            }
                        }
                    }
                    var section_four = JSON.parse(updatesetting[0].sett_sect4)
                    for (var i = 1; i <= 3; i++) {
                        if (section_four['image' + i] != '') {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + section_four['image' + i]));
                        }
                    }
                    var section_five = JSON.parse(updatesetting[0].sett_sect5)
                    var images_section_five = ['icon', 'image_googleplay', 'image_appstore', 'image_fondo', 'image']
                    for (var k in section_five) {
                        for (let j = 0; j < images_section_five.length; j++) {
                            if (k == images_section_five[j] && section_five[k] != '') {
                                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + section_five[k]));
                            }
                        }
                    }
                    resolve('Configuración eliminada correctamente')
                } else {
                    resolve('Configuración no encontrada')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación de la configuración')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Configuración inválida")
        })
    }
}

async function listSetting(req, res) 
{
    return new Promise(async(resolve) => {
        var result = await (setting_model.findAll())
        var settings = {};
        var count_settings = result.length;
        if (count_settings > 0) {
            var allsettings = []
            for (var i = 0; i < result.length; i++) {
                settings = {};
                settings.id = result[i].sett_ide;
                settings.logo = result[i].sett_logo;
                settings.section_one = JSON.parse(result[i].sett_sect1);
                settings.section_two = result[i].sett_sect2;
                settings.section_three = result[i].sett_sect3;
                settings.section_four = JSON.parse(result[i].sett_sect4);
                settings.section_five = JSON.parse(result[i].sett_sect5);
                settings.banner = result[i].sett_banner; 
                allsettings.push(settings)
            }
            resolve(allsettings)
        } else {
            resolve('No hay ninguna configuración para mostrar')
        }   
    })
}

async function getSettingById(req, id) 
{
    var sett_ide = parseInt(id);
    if (Number.isInteger(sett_ide) && sett_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (setting_model.findAll({ where: { sett_ide:  sett_ide } }))
            var count_setting = result.length;
            if (count_setting > 0) {
                var result_setting = {};
                result_setting.id = result[0].sett_ide;
                result_setting.logo = result[0].sett_logo;
                result_setting.section_one = JSON.parse(result[0].sett_sect1);
                result_setting.section_two = result[0].sett_sect2;
                result_setting.section_three = result[0].sett_sect3;
                result_setting.section_four = JSON.parse(result[0].sett_sect4);
                result_setting.section_five = JSON.parse(result[0].sett_sect5);
                result_setting.banner = result[0].sett_banner;
                resolve(result_setting)
            } else {
                resolve('No hay ninguna configuración para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve("Configuración inválida")
        })
    }
}
module.exports.createSetting = createSetting
module.exports.updateSetting = updateSetting
module.exports.deleteSetting = deleteSetting
module.exports.listSetting = listSetting
module.exports.getSettingById = getSettingById
