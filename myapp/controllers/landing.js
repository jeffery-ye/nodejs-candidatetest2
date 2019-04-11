
const models = require('../models')

let { isLoggedIn, hasAuth } = require('../middleware/hasAuth.js')


const Pool = require('pg').Pool
const pgpool = new Pool({
	connectionLimit: 10,
	host: 'localhost',
	port: '5432',
	user: 'Siyuan',
	password: '123.456',
	database: 'express-mvp-db'
})


exports.get_landing = function (req, res, next) {
	getComments(function (err, results) {
		if (err) {
			console.log("error", err)
		}
		else {
			console.log("results from db", results)
		}
		const sql_query = "SELECT * FROM cheatsheet order by ts desc LIMIT 10"
		pgpool.query(sql_query, [], (err, rows) => {
			if (err) {
				console.log("Failed to find user")
				return
			}
			console.log(rows.rows)
			//res.render('postgres/cheatsheet', { cheatsheet: rows.rows, user: req.user });
			res.render('landing', { title: 'Express', cheatsheet: rows.rows, comments: results, user: req.user, isLoggedIn: isLoggedIn });
		})
	})
}


//const sql_query = "SELECT * FROM comments"


//pgpool.query(sql_query, [], (err, rows) => {
//	if (err) {
//		console.log("Failed to find user")
//		return
//	}
//console.log(rows.rows)
//results = getResults()
//res.render('common/comments', { comments: rows.rows, user: req.user });


//res.render('landing', { title: 'Express', comments: rows.rows, user: req.user, isLoggedIn: isLoggedIn });
//})
//getResults()



exports.submit_lead = function (req, res, next) {

	return models.Lead.create({
		email: req.body.lead_email
	}).then(lead => {
		res.redirect('/leads');
	})
}

exports.show_leads = function (req, res, next) {
	return models.Lead.findAll().then(leads => {

		getComments(function (err, results) {
			if (err) {
				console.log("error", err)
			}
			else {
				console.log("results from db", results)
			}
			res.render('lead/leads', { title: 'Express', comments: results, leads: leads, user: req.user, isLoggedIn: isLoggedIn });

		})

		//res.render('lead/leads', { title: 'Express', leads: leads, user: req.user });
	})
}

exports.show_lead = function (req, res, next) {
	return models.Lead.findOne({
		where: {
			id: req.params.lead_id
		}
	}).then(lead => {
		res.render('lead/lead', { lead: lead, user: req.user });
	});
}

exports.show_edit_lead = function (req, res, next) {
	return models.Lead.findOne({
		where: {
			id: req.params.lead_id
		}
	}).then(lead => {
		getComments(function (err, results) {
			if (err) {
				console.log("error", err)
			}
			else {
				console.log("results from db", results)
			}
			//res.render('landing', { title: 'Express', comments: results, user: req.user, isLoggedIn: isLoggedIn });

		})
		res.render('lead/edit_lead', { comments: results, lead: lead, user: req.user });
	});
}

exports.edit_lead = function (req, res, next) {

	return models.Lead.update({
		email: req.body.lead_email
	}, {
			where: {
				id: req.params.lead_id
			}
		}).then(result => {

			res.redirect('/lead/' + req.params.lead_id);
		})
}
exports.delete_lead = function (req, res, next) {
	return models.Lead.destroy({
		where: {
			id: req.params.lead_id
		}
	}).then(result => {
		res.redirect('/leads');
	})
}

exports.delete_lead_json = function (req, res, next) {
	return models.Lead.destroy({
		where: {
			id: req.params.lead_id
		}
	}).then(result => {
		res.send({ msg: "Success" });
	})
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