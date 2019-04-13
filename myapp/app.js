var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let passport = require('passport');
let session = require('express-session')



const mysql = require('mysql')
const postgres = require('pg')
const ejs = require('ejs')
const bodyParser = require('body-parser')

require('./passport_setup')(passport);

var app = express();

//app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'our new secret'}));
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postgresRouter = require('./routes/postgres');
//var siyuanRouter = require('./routes/siyuan');


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/postgres', postgresRouter);

//app.use('/siyuan', siyuanRouter);

//mysql connection 

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'siyuan',
  password: 'siyuan05',
  database: 'nodejs'
})

function getConnection() {
  return pool
}


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



