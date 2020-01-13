'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createFavoriteProduct, updateFavoriteProduct,deleteFavoriteProduct,getFavoriteProduct}  = require('../controllers/Favoriteproducts'),
    prefix_api = '/api',
    bodyParser = require('body-parser');

bodyParser.json({limit: "50mb", extended: true});
bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:100000000});

//Crear un nuevo producto favorito del usuario
router.post(prefix_api + '/favoriteproduct/create', async function(req, res) {
    var result = await(createFavoriteProduct(req, res))
    var message, status
    if (result == 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result == 'Producto favorito creado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

//Actualizar un producto favorito del usuario
router.put(prefix_api + '/favoriteproduct/update', async function(req, res) {
    var result = await(updateFavoriteProduct(req, res))
    var message, status
    if (result == 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result == 'Producto favorito del usuario actualizado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar un producto favorito del usuario
router.delete(prefix_api + '/favoriteproduct/delete/:fapr_ide', async function(req, res) {
    var result = await(deleteFavoriteProduct(req, res))
    var message, status
    if (result == 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result == 'Producto favorito del usuario eliminado correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener los productos favoritos de un usuario
router.get(prefix_api + '/favoriteproduct/getfavoriteproduct', async function(req, res) {
    var result = await(getFavoriteProduct(req))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

module.exports = router;