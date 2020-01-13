var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var moduleRouter = require('./routes/modules');
var permissioncrudsRouter = require('./routes/permissioncruds');
var permissionRouter = require('./routes/permissions');
var accessRouter = require('./routes/access');
var usertypeRouter = require('./routes/usertypes');
var accesstypeuserRouter = require('./routes/accesstypeusers');
var settingsRouter = require('./routes/settings');
var productsRouter = require('./routes/products');
var favoriteproductRouter = require('./routes/favoriteproducts');
var storeRouter = require('./routes/stores');

var app = express();

var cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:100000000}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', moduleRouter);
app.use('/', permissioncrudsRouter);
app.use('/', permissionRouter);
app.use('/', accessRouter);
app.use('/', usertypeRouter);
app.use('/', accesstypeuserRouter);
app.use('/', settingsRouter);
app.use('/', productsRouter);
app.use('/', favoriteproductRouter);
app.use('/', storeRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(session({secret: '123456', resave: true, saveUninitialized: true}));
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
