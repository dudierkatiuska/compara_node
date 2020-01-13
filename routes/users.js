'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createUser, listUser, updateUser, deleteUser, getUserById, getUserByToken, getCategoriesUser, getSocialsUser }  = require('../controllers/Users'),
    prefix_api = '/api'

//Crear un nuevo usuario
router.post(prefix_api + '/users/create', async function(req, res) {
    var result = await (createUser(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Usuario creado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Actualizar usuario
router.put(prefix_api + '/users/update', async function(req, res) {
    var result = await(updateUser(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Usuario actualizado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar usuario
router.delete(prefix_api + '/users/delete/:user_ide', async function(req, res) {
    var result = await(deleteUser(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Usuario eliminado correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener todos los usuarios
router.get(prefix_api + '/users/getAll', async function(req, res) {
    var result = await(listUser(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener un usuario específico
router.get(prefix_api + '/users/getById/:user_ide', async function(req, res) {
	var user_ide = req.params.user_ide;
    var result = await(getUserById(req, user_ide))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener un usuario específico por token
router.get(prefix_api + '/users/getByToken', async function(req, res) {
    var result = await(getUserByToken(req))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener las categorías de un usuario
router.get(prefix_api + '/users/getCategoriesUser', async function(req, res) {
    var result = await(getCategoriesUser(req))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener las redes sociales de un usuario
router.get(prefix_api + '/users/getSocialsUser', async function(req, res) {
    var result = await(getSocialsUser(req))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

module.exports = router;