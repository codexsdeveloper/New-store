require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {Connect_DataBase} = require('./database/databse')
var session = require('express-session')
var flash = require('connect-flash');

var indexRouter = require('./users/index');
var usersRouter = require('./users/users');

//user 
const RegisterRouter = require('./users/register')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


 // Session Setup
 app.use(session({
  path: "/",
  name: 'Cookies_zyx', //Flash Sesson
  // It holds the secret key for session
  secret: process.env.Cookies_zyx,
  // Forces the session to be saved
  // back to the session store
  resave: false,
  saveUninitialized:true,
  // Forces a session that is "uninitialized"
  // to be saved to the store 
  cookie: {maxAge: new Date(Date.now() + 900000)}
}))

app.use(flash())

app.use(function(req, res, next){
  res.locals.session = req.session
  next()
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', RegisterRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
