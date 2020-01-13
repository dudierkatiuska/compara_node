
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    bodyParser = require('body-parser'),
    { createCategory, listCategory, updateCategory, deleteCategory,getCategoryById }  = require('../controllers/Categories.js'),
    { createSubcategory, listSubcategory, updateSubcategory, deleteSubcategory, getSubcategoryById }  = require('../controllers/Subcategories.js'),
    { createCity, listCity, updateCity, deleteCity,getCityById }  = require('../controllers/Cities'),
    { loadScripts } = require('../config/load_scripts'),
    prefix_api = '/api'

// support parsing of application/json type post data
router.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }));


/* GET home page. */
router.get('/', function(req, res, next) {

res.render('index', { title: 'Express' });
});



//Crear un nueva categoría
router.post(prefix_api + '/category/create', async function(req, res) {
var result = await(createCategory(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Categoría creada correctamente') {
    res.status(201)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Actualizar categoría
router.put(prefix_api + '/category/update/:cate_ide', async function(req, res) {
var result = await(updateCategory(req, res))
console.log(result)
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Categoría actualizada correctamente') {
    res.status(201)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Borrar categoría
router.delete(prefix_api + '/category/delete/:cate_ide', async function(req, res) {
var result = await(deleteCategory(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Categoría eliminada correctamente') {
    res.status(203)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Obtener todas las categoría
router.get(prefix_api + '/category/getAll', async function(req, res) {
var result = await(listCategory(req, res))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Obtener una categoría específica
router.get(prefix_api + '/category/getById/:cate_ide', async function(req, res) {
var cate_ide = req.params.cate_ide;
var result = await(getCategoryById(req, cate_ide))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});

//Crear un nueva subcategoría
router.post(prefix_api + '/subcategory/create', async function(req, res) {
var result =  await (createSubcategory(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Subcategoría creada correctamente') {
    res.status(201)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Actualizar subcategoría
router.put(prefix_api + '/subcategory/update/:suca_ide', async function(req, res) {
var result = await(updateSubcategory(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Subcategoría actualizada correctamente') {
    res.status(201)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Borrar Subcategoría
router.delete(prefix_api + '/subcategory/delete/:suca_ide', async function(req, res) {
var result = await(deleteSubcategory(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Subcategoría eliminada correctamente') {
    res.status(203)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Obtener todas las Subcategoría
router.get(prefix_api + '/subcategory/getAll', async function(req, res) {
var result = await(listSubcategory(req, res))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});

//Obtener una Subcategoría específica
router.get(prefix_api + '/subcategory/getById/:suca_ide', async function(req, res) {
var suca_ide = req.params.suca_ide;
var result = await(getSubcategoryById(req, suca_ide))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});

//Crear una nueva ciudad
router.post(prefix_api + '/city/create', async function(req, res) {
    var result = await(createCity(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Ciudad creada correctamente') {
        res.status(201)
        status = 'success'
    } else {
        status = 'error'
        res.status(400)
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Actualizar ciudad
router.put(prefix_api + '/city/update/:city_ide', async function(req, res) {
    var result = await(updateCity(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Ciudad actualizada correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar ciudad
router.delete(prefix_api + '/city/delete/:city_ide', async function(req, res) {
    var result = await(deleteCity(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Ciudad eliminada correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener todas los ciudades
router.get(prefix_api + '/city/getAll', async function(req, res) {
	var result = await(listCity(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener una ciudad específica
router.get(prefix_api + '/city/getById/:city_ide', async function(req, res) {
	var city_ide = req.params.city_ide;
	var result = await(getCityById(req, city_ide))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//cargar script
router.post(prefix_api + '/loadscripts', async function(req, res) {
	var result = await(loadScripts())
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
module.exports = router;
