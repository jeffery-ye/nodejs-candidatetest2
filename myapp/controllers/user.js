
let models = require("../models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
let flash = require('connect-flash');
const { isEmpty } = require('lodash');
const { validateUser } = require('../validators/signup');



const Pool = require('pg').Pool
const pgpool = new Pool({
	connectionLimit: 10,
	host: 'localhost',
	port: '5432',
	user: 'Siyuan',
	password: '123.456',
	database: 'express-mvp-db'
})


exports.show_login = function (req, res, next) {
	getComments(function (err, results) {
		if (err) {
			console.log("error", err)
		}
		else {
			console.log("results from db", results)
		}
		//res.render('landing', { title: 'Express', comments: results, user: req.user, isLoggedIn: isLoggedIn });
		res.render('users/login', { comments: results, formData: {}, errors: {}, user: req.user });
	})
}

exports.show_signup = function (req, res, next) {
	res.render('users/signup', { formData: {}, errors: {}, user: req.user });
}

exports.search_user = function (req, res, next) {
	res.render('users/signup', { formData: {}, errors: {}, user: req.user });
}




const rerender_signup = function (errors, req, res, next) {
	res.render('users/signup', { formData: req.body, errors: errors, user: req.user });
}
const generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

exports.signup = function (req, res, next) {
	let errors = {};
	return validateUser(errors, req).then(errors => {
		if (!isEmpty(errors)) {
			rerender_signup(errors, req, res, next);
		} else {
			return models.User.findOne({
				where: {
					is_admin: true
				}
			}).then(user => {
				let newUser;
				if (user !== null) {
					newUser = models.User.build({
						email: req.body.email,
						password: generateHash(req.body.password)
					});
				} else {
					newUser = models.User.build({
						email: req.body.email,
						password: generateHash(req.body.password),
						is_admin: true
					});
				}
				return newUser.save().then(result => {
					passport.authenticate('local', {
						successRedirect: "/",
						failureRedirect: "/signup",
						failureFlash: true
					})(req, res, next);
				})
			})
		}
	})
}

exports.login = function (req, res, next) {
	passport.authenticate('local', {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	})(req, res, next);
}
exports.logout = function (req, res, next) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
}



function getComments(callback) {
	const sql_query = "SELECT * FROM comments"
	pgpool.query(sql_query, [], (err, rows) => {
		if (err) {
			callback(err, null)
		}
		else {
			callback(null, rows.rows)
		}
		//res.render('landing', { title: 'Express', comments: rows.rows, user: req.user, isLoggedIn: isLoggedIn });
		//})
	})
}

