var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'pug');
app.use(session({
	secret: 'dalat',
	resave: true,
	saveUninitialized: true,
}));
app.use('/', indexRouter);

var session_checker = (req,res,next) => {
	if(req.session.authenticated) {
		console.log("logged");
	} else {
		next();
	}
}
module.exports = app;
