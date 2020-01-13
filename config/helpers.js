'use strict'
const path = require('path'),
    base_url = path.dirname(require.main.filename),
    user_model = require('../models/user'),
    access_model = require('../models/access'),
    category_model = require('../models/category'),
    city_model = require('../models/city'),
    subcategory_model = require('../models/subcategory'),
    store_model = require('../models/store'),
    Op = require('../config/config').op,
    regex_password =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_\-])[A-Za-z\d$@$!%*?&#.$($)$-$_\-]{6,}$/,
    regex_email = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
    regex_url = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
    { checkToken } = require('../config/tokens'),
    responses_helper = require('../config/responses'),
    responses =  responses_helper.responses

function json2array(json)
{
    var result = []
    var keys = Object.keys(json)
    keys.forEach(function(key){
        result.push(json[key])
    })
    return result
}

function removeDuplicates(values)
{
    return [...new Set(values)]
}

async function validateParams(entity, request)
{
    var errors = [],
        form_errors = {}
    var body_request = request.body
    if (entity === 'usertype') {
        if (body_request.description !== null && body_request.status !== null) {
            if ((isString(body_request.description) && body_request.description !== '') && isBoolean(body_request.status)) {
                return 'Correcto'
            } else {
                return 'La descripción o el estatus son inválidos'
            }
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'user') {
        if (body_request.email !== null && body_request.username !== '' && body_request.password !== '') {
            if (!await(isEmail(body_request.email))) {
                form_errors.email_invalid = 'El correo es inválido'
            } else {
                if (await(checkEmail(body_request.email))) {
                    form_errors.email_duplicated = 'El correo ya existe en la base de datos'
                }
            }
            if (await(checkUsername(body_request.username))) {
                form_errors.username_invalid = 'El username ya existe en la base de datos'
            }
            if (!await(validPassword(body_request.password))) {
                form_errors.password_invalid = 'La contraseña debe contener mínimo 6 caracteres, al menos 1 letra mayúscula, 1 letra minúscula, 1 número y 1 caracter especial'
            }
            if (Object.keys(form_errors).length > 0) {
                errors.push(form_errors)
                return errors
            } else {
                return 'Correcto'
            }
        } else {
            return 'Los campos son requeridos'
        }
    }  else if (entity === 'userupdate') {
        var token = request.headers.authentication
        var result_token = await(checkToken(token))
        if (body_request.username !== '' && body_request.name !== '') {
            if (await(checkUsername(body_request.username, result_token)|| body_request.username === '')) {
                form_errors.username_invalid = 'El username ya existe en la base de datos'
            }
            if (!await(validPassword(body_request.password))) {
                form_errors.password_invalid = 'La contraseña debe contener mínimo 6 caracteres, al menos 1 letra mayúscula, 1 letra minúscula, 1 número y 1 caracter especial'
            }
            if (Object.keys(form_errors).length > 0) {
                errors.push(form_errors)
                return errors
            } else {
                return 'Correcto'
            }
        } else {
            return 'Los campos de nombre, username son requeridos'
        }
    } else if (entity === 'category') {
        if (body_request.description !== null && body_request.status !== null && body_request.url !== null) {
            if ((isString(body_request.description) && body_request.description !== '') && (isBoolean(body_request.status) && body_request.status !== '') && (body_request.url !== '')) {
                if (!await(isValidCategory(body_request.description))) {
                    form_errors.category_invalid = 'La categoría ya existe en la base de datos'    
                }
                if (Object.keys(form_errors).length > 0) {
                    errors.push(form_errors)
                    return errors
                } else {
                    return 'Correcto'
                }
            } else {
                if ((!isString(body_request.description) || body_request.description === '')) {
                    form_errors.description_required = 'La descripción es requerida'
                }
                if (!isBoolean(body_request.status) || body_request.status === '') {
                    form_errors.status_required = 'El estatus es requerido'
                }
                if (body_request.url === '') {
                    form_errors.url_required = 'La imagen de la categoría es requerida'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'login') {
        if (body_request.email !== null && body_request.password !== null) {
            if ((isString(body_request.email) && body_request.email !== '') && (isString(body_request.password) && body_request.password !== '')) {
                return 'Correcto'
            } else {
                form_errors.all_required_fields = "Todos los campos son requeridos"
            }             
        } else {
            form_errors.all_required_fields = "Todos los campos son requeridos"
        }
        errors.push(form_errors)
        return errors
    } else if (entity === 'register') {
        if (body_request.email !== null && body_request.password !== null) {
            if ((isString(body_request.email) && body_request.email !== '') && (isString(body_request.password) && body_request.password !== '')) {
                if (!await(isEmail(body_request.email))) {
                    form_errors.email_invalid = 'El correo es inválido'
                } else {
                    if (await(checkEmail(body_request.email))) {
                        form_errors.email_duplicated = 'El correo ya existe en la base de datos'
                    }
                }
                if (!await(validPassword(body_request.password))) {
                    form_errors.password_invalid = 'La contraseña debe contener mínimo 6 caracteres, al menos 1 letra mayúscula, 1 letra minúscula, 1 número y 1 caracter especial'
                }
                if (!await(passwordsMatch(body_request.password, body_request.password_confirm))) {
                    form_errors.password_invalid = 'Las contraseñas no coinciden'
                }
                if (Object.keys(form_errors).length > 0) {
                    errors.push(form_errors)
                    return errors
                } else {
                    return 'Correcto'
                }
            } else {
                return "Todos los campos son requeridos"
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'module') {
        if (body_request.description !== null && body_request.visibility !== null && body_request.icon !== null) {
            if ((isString(body_request.description) && body_request.description !== '') && (isBoolean(body_request.visibility) && body_request.visibility !== '') && (body_request.icon !== '')) {
                return 'Correcto'
            } else {
                if ((!isString(body_request.description) || body_request.description === '')) {
                    form_errors.description_required = 'La descripción es requerida'
                }
                if (!isBoolean(body_request.visibility) || body_request.visibility === '') {
                    form_errors.visibility_required = 'El visibilidad es requerida'
                }
                if (body_request.icon === '') {
                    form_errors.icon_required = 'La imagen del módulo es requerida'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'submodule') {
        if (body_request.description !== null && body_request.order !== null && body_request.icon !== null && body_request.url != null && body_request.modu !== null ) {
            if ((isString(body_request.description) && body_request.description !== '') && (isBoolean(body_request.order) && body_request.order !== '') && (body_request.icon !== '') && (body_request.url !== '') && (body_request.modu !== '')) {
                return 'Correcto'
            } else {
                if ((!isString(body_request.description) || body_request.description === '')) {
                    form_errors.description_required = 'La descripción es requerida'
                }
                if (!isBoolean(body_request.order) || body_request.order === '') {
                    form_errors.order_required = 'La visibilidad es requerida'
                }
                if (body_request.icon === '') {
                    form_errors.icon_required = 'La imagen del módulo es requerida'
                }
                if (body_request.url === '') {
                    form_errors.url_required = 'La url del submódulo es requerida'
                }
                if (body_request.modu === '') {
                    form_errors.modu_required = 'El id de módulo es requerido'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'subcategory') {
        if (body_request.description !== null && body_request.category !== null && body_request.status !== null) {
            if ((isString(body_request.description) && body_request.description !== '') && body_request.category !== '' && (isBoolean(body_request.status) && body_request.status !== '')) {
                if (!await(isValidSubcategory(body_request.description))) {
                    form_errors.Subcategory_invalid = 'La subcategoría ya existe en la base de datos'    
                }
                if (Object.keys(form_errors).length > 0) {
                    errors.push(form_errors)
                    return errors
                } else {
                    return 'Correcto'
                }
            } else {
                if ((!isString(body_request.description) || body_request.description === '')) {
                    form_errors.description_required = 'La descripción es requerida'
                }
                if (body_request.category === '') {
                    form_errors.category_required = 'El id de la categoría es requerido'
                }
                if (!isBoolean(body_request.status) || body_request.status === '') {
                    form_errors.status_required = 'El status es requerido'
                }
                if (body_request.url === '') {
                    form_errors.url_required = 'La imagen de la subcategoría es requeria'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity == 'permission') {
        if (body_request.accesstypeuser !== null && body_request.submodulo !== null && body_request.permissioncrud !== null && body_request.status !== null ) {
            if (body_request.accesstypeuser !== '' && body_request.submodulo !== '' && body_request.permissioncrud !== ''&& (isBoolean(body_request.status) && body_request.status !== '')) {
                return 'Correcto'
            } else {
                if (body_request.accesstypeuser === '') {
                    form_errors.accesstypeuser_required = 'El id del acceso es requerido'
                }
                if (body_request.submodulo === '') {
                    form_errors.submodulo_required = 'El id del submodúlo es requerido'
                }
                if (body_request.permissioncrud === '') {
                    form_errors.permissioncrud_required = 'El id del permiso es requerido'
                }
                if (!isBoolean(body_request.status) || body_request.status === '') {
                    form_errors.status_required = 'El status es requerido'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'permissioncrud') {
        if (body_request.description !== null && body_request.url !== null && body_request.icon !== null ) {
            if ((isString(body_request.description) && body_request.description !== '') !== '' && body_request.url !== '' && body_request.icon !== ''  ) {
                return 'Correcto'
            } else {
                if ((!isString(body_request.description) || body_request.description === '')) {
                    form_errors.description_required = 'La descripción es requerida'
                }
                if (body_request.url === '') {
                    form_errors.url_required = 'La url es requerida'
                }
                if (body_request.icon === '') {
                    form_errors.icon_required = 'El icono es requerido'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    }  else if (entity === 'accesstypeuser') {
        if (body_request.usertype !== null) {
            if (body_request.usertype !== '') {
                return 'Correcto'
            } else {
                if (body_request.usertype === '') {
                    form_errors.usertype_required = 'El tipo de usuario es requerido'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'El campo del tipo de usuario es requerido'
        }
    } else if (entity === 'settings') {
        if (body_request.logo !== null ) {
            if (body_request.logo !== '' ) {
                return 'Correcto'
            } else {
                if (body_request.logo === '') {
                    form_errors.logo_required = 'La imagen del logo es requerida'
                }
                errors.push(form_errors)
                return errors
            }             
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'city') {
        if (body_request.description !== null  != null && body_request.status !== null) {
            if ((isString(body_request.description) && body_request.description !== '') && (isBoolean(body_request.status) && body_request.status !== '')) {
                if (!await(isValidCity(body_request.description))) {
                    form_errors.city_invalid = 'La ciudad ya existe en la base de datos'    
                }
                if (Object.keys(form_errors).length > 0) {
                    errors.push(form_errors)
                    return errors
                } else {
                    return 'Correcto'
                }
            } else {
                if ((!isString(body_request.description) || body_request.description === '')) {
                    form_errors.description_required = 'La descripción es requerida'
                }
                if (!isBoolean(body_request.status) || body_request.status == '') {
                    form_errors.status_required = 'El estatus es requerido'
                }
                errors.push(form_errors)
                return errors
            }
        } else {
            return 'Todos los campos son requeridos'
        }
    } else if (entity === 'recover_password') {
        if (body_request.email !== null) {
            if ((isString(body_request.email) && body_request.email !== '')) {
                if (!await(isEmail(body_request.email))) {
                    form_errors.email_invalid = 'El correo es inválido'
                } else {
                    if (!await(checkEmail(body_request.email))) {
                        form_errors.email_duplicated = 'El usuario no existe en la base de datos'
                    }
                }
                if (Object.keys(form_errors).length > 0) {
                    errors.push(form_errors)
                    return errors
                } else {
                    return 'Correcto'
                }
            } else {
                if ((!isString(body_request.email) || body_request.email === '')) {
                    form_errors.email_required = 'El correo es requerido'
                }
                errors.push(form_errors)
                return errors
            }
        } else {
            return 'El correo es requerido'
        }
    } else if (entity === 'store') {
        if (body_request.name !== null && body_request.url !== null && body_request.typestore !== null && body_request.userkey !== null && body_request.secretkey !== null && body_request.city !== null && body_request.status !== null ) {
            if ((isString(body_request.name) && body_request.name !== '') && body_request.url !== '' && body_request.typestore !== '' && body_request.userkey !== '' && body_request.secretkey !== '' && body_request.city !== '' && (isBoolean(body_request.status) && body_request.status !== '')) {
                if (!await(isValidStore(body_request.name))) {
                    form_errors.tienda_invalid = 'La tienda ya existe en la base de datos'    
                }
                if (Object.keys(form_errors).length > 0) {
                    errors.push(form_errors)
                    return errors
                } else {
                    return 'Correcto'
                }
            } else {
                if ((!isString(body_request.name) || body_request.name === '')) {
                    form_errors.name_required = 'El nombre es requerido'
                }
                if (body_request.url === '') {
                    form_errors.url_required = 'La url de la tienda es requerida'
                }
                if (body_request.typestore === '') {
                    form_errors.typestore_required = 'El tipo de tienda es requerido'
                }
                if (body_request.userkey === '') {
                    form_errors.userkey_required = 'la clave de usuario de la Api es requerida'
                }
                if (body_request.secretkey === '') {
                    form_errors.secretkey_required = 'la clave secreta de la Api es requerida'
                }
                if (body_request.city === '') {
                    form_errors.city_required = 'la ciudad de la tienda es requerida'
                }
                if (!isBoolean(body_request.status) || body_request.status == '') {
                    form_errors.status_required = 'El estatus es requerido'
                }
                errors.push(form_errors)
                return errors
            }
        } else {
            return 'Todos los campos son requeridos'
        }
    }
}

function isBoolean( n )
{
    return !!n === n || n === 0 || n === 1
}

function isNumber( n )
{
    return +n === n
}

function isString( n )
{
    return ''+n === n
}

async function isEmail(email)
{
    return email.match(regex_email); 
}

async function isUrl(uri)
{
    return uri.match(regex_url); 
}


async function checkEmail(email)
{
    var result_users = await user_model.findAll({})
    if (result_users.length > 0) {
        for (var i in result_users) {
            if (result_users[i].user_email === email) {
                return true
            }
        }
        return false
    } else {
        return false
    }
}

async function checkUsername(username, update = null)
{
    if (update === null) {
        var result_username = await access_model.findAll({
            attributes: ['acce_ide'],
            where:{
                acce_username: username
            }
        })
    } else {
        var result_username = await access_model.findAll(
        { where:
            {
                acce_user: {[Op.ne]: update},
                acce_username: username
            }
        })
    }
    var count_access = result_username.length;
    if (count_access > 0) {
        return true
    } else {
        return false
    }
}

async function checkSubcategory(ide)
{
    var result_subcategory = await subcategory_model.findAll({
        where:{
            suca_ide: ide
        }
    })
    var count_subcategory = result_subcategory.length;
    if (count_subcategory > 0) {
        return true
    } else {
        return false
    }
}


async function validPassword(password)
{
    return password.match(regex_password)
}

async function passwordsMatch(password, confirm)
{
    if (password === confirm) {
        return true
    } else {
        return false
    }
}

async function isValidCategory(category)
{
    var result_category = await category_model.findAll({
        where:{
            cate_description: category
        }
    })
    if (result_category.length > 0) {
        return false
    } else {
        return true
    }
}

async function isValidSubcategory(subcategory)
{
    var result_subcategory = await subcategory_model.findAll({
        where:{
            suca_description: subcategory
        }
    })
    if (result_subcategory.length > 0) {
        return false
    } else {
        return true
    }
}

async function parseResponse(value) 
{
    var response = [],
    form_response = {},
    key = ''
    if (typeof value === 'string') {
        key = responses_helper.getKeyResponse(value)
        form_response[key] = value
        response.push(form_response)
    } else {
        response = value
    }
    return response
}
async function isValidCity(city)
{
    var result_city = await city_model.findAll({
        where:{
            city_description: city
        }
    })
    if (result_city.length > 0) {
        return false
    } else {
        return true
    }
}
async function isValidStore(store)
{
    var result_store = await store_model.findAll({
        where:{
            stor_name: store
        }
    })
    if (result_store.length > 0) {
        return false
    } else {
        return true
    }
}


module.exports.json2array = json2array
module.exports.removeDuplicates = removeDuplicates
module.exports.base_url = base_url
module.exports.validateParams = validateParams
module.exports.isBoolean = isBoolean
module.exports.isNumber = isNumber
module.exports.isString = isString
module.exports.isEmail = isEmail
module.exports.isUrl = isUrl
module.exports.validPassword = validPassword
module.exports.checkEmail = checkEmail
module.exports.checkSubcategory = checkSubcategory
module.exports.checkUsername = checkUsername
module.exports.isValidCategory = isValidCategory
module.exports.isValidSubcategory = isValidSubcategory
module.exports.parseResponse = parseResponse
module.exports.isValidCity = isValidCity
module.exports.isValidStore = isValidStore