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

app.use(bodyParser.urlencoded({ extended: false }))


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



//function getPGConnection() {
 // return pgpool
//}


/*
app.post('/createuseroutput', (req, res) => {
  //const con = getPGConnection()
  const firstName = req.body.first_name
  const lastName = req.body.last_name
  //console.log(firstName)
  //console.log(pgpool)
  //NOTE: Select check if the username already exists. IF not, continue. Otherwise, return an error "User already exists"
  const sql = "INSERT INTO userreg (first_name, last_name) values ($1,$2)"
  pgpool.query(sql, [firstName, lastName], (err, rows) => {

    if (err) {
      console.log(err)
    }
    //response.status(200).json(rows.rows)
    const new_user = { "firstName": firstName, "lastName": lastName}
      
    res.render('user/createuseroutput.ejs', {new_user, user: req.user})
  })
})

*/

//app.get('/usersearch', (req, res) => {
//    res.render('user/usersearch.ejs')
//    console.log("Connected to Form")
//})

/*
app.post('/usersearchresults', (req, res) => {
    //const con = getPGConnection()
    const firstName = req.body.first_name.toUpperCase()
    const lastName = req.body.last_name.toUpperCase()
    const users = [{}]
    const sql = "SELECT * FROM userreg WHERE upper(first_name) = $1 or upper(last_name) = $2"
    pgpool.query(sql, [firstName, lastName], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find user")
            return
        }
        //res.status(200).json(rows.rows)
        console.log(rows.rows)
        //rows.map((row) => {
        //    const user = { firstName: row.first_name, lastName: row.last_name }
        //    users.push(user)
        //})
       
        res.render('user/usersearchresults.ejs', { users: rows.rows, user: req.user })
    })
})
*/

/*

//Postgresql connection
//https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8
const Pool =require('pg').Pool
const pgpool = new Pool({
  connectionLimit: 10,
  host: 'localhost',
  port: '5432',
  user: 'Siyuan',
  password: '123.456',
  database: 'express-mvp-db'
})
*/