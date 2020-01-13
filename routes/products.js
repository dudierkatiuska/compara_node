'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { searchProduct, getTopSearches, filterBy, productHomePage }  = require('../controllers/Products'),
    prefix_api = '/api',
    bodyParser = require('body-parser');

bodyParser.json({limit: "50mb", extended: true});
bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:100000000});

router.get(prefix_api + '/product/searchProduct/:key', async function(req, res) {
	var result = await(searchProduct(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

router.get(prefix_api + '/product/gettopsearches', async function(req, res) {
	var result = await(getTopSearches(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

router.get(prefix_api + '/product/filterby/:key', async function(req, res) {
	var result = await(filterBy(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

router.get(prefix_api + '/product/productHomePage/:key', async function(req, res) {
	var result = await(productHomePage(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
module.exports = router;