
let models = require("../models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
let flash = require('connect-flash');
const { isEmpty } = require('lodash');
const { validateUser } = require('../validators/signup');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 's.jeffery.ye@gmail.com',
        pass: 'Siyuan05'
    }
});

// var mailOptions = {
//     from: 's.jeffery.ye@gmail.com',
//     to: 's.jeffery.ye@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };


exports.create_user = function (req, res, next) {
    res.render('postgres/createuser', { formData: {}, errors: {}, user: req.user });
}

exports.search_user = function (req, res, next) {
    res.render('postgres/usersearch', { formData: {}, errors: {}, user: req.user });
}

const Pool = require('pg').Pool
const pgpool = new Pool({
    connectionLimit: 10,
    host: 'localhost',
    port: '5432',
    user: 'Siyuan',
    password: '123.456',
    database: 'express-mvp-db'
})

exports.user_created = function (req, res, next) {
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const sql = "INSERT INTO userreg (first_name, last_name) values ($1,$2)"
    pgpool.query(sql, [firstName, lastName], (err, rows) => {
        if (err) {
            console.log(err)
        }
        //response.status(200).json(rows.rows)
        const new_user = { "firstName": firstName, "lastName": lastName }
        res.render('postgres/createuseroutput', { formData: {}, errors: {}, new_user: new_user, user: req.user });
    })
}


exports.search_results = function (req, res, next) {
    const firstName = req.body.first_name.toUpperCase()
    const lastName = req.body.last_name.toUpperCase()
    //const users = [{}]
    const sql = "SELECT * FROM userreg WHERE upper(first_name) = $1 or upper(last_name) = $2"
    pgpool.query(sql, [firstName, lastName], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find user")
            return
        }
        //res.status(200).json(rows.rows)
        console.log(rows.rows)

        res.render('postgres/usersearchresults', { users: rows.rows, user: req.user })
    })
}

exports.create_course = function (req, res, next) {
    const username = req.user.email
    const sql = "SELECT * FROM courseschedule WHERE username = $1"
    pgpool.query(sql, [username], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find user")
            return
        }
        //res.status(200).json(rows.rows)
        console.log(rows.rows)
        res.render('postgres/createcourse', { courses: rows.rows, user: req.user });
    })
}

exports.insert_course = function (req, res, next) {
    const daytype = req.body.daytype
    const period = req.body.period
    const coursename = req.body.coursename
    const username = req.user.email
    const sql_return_course = "SELECT * FROM courseschedule WHERE username = $1"
    const sql_insert = "INSERT INTO courseschedule (daytype, period, coursename, username) values ($1, $2, $3, $4)"
    const sql_check_exist = "SELECT * FROM courseschedule WHERE username = $1 and daytype = $2 and period = $3"
    const sql_update = "update courseschedule set coursename = $1 where daytype  = $2 and period = $3"
    pgpool.query(sql_check_exist, [username, daytype, period], (err, rows) => {
        if (err) {
            console.log("Failed to find user")
            return
        }
        console.log("user name --- ", rows.rows)

        if (rows && rows.rows.length > 0) {
            console.log("user name ---------- " + rows.rows)
            pgpool.query(sql_update, [coursename, daytype, period], (err, rows) => {
                if (err) {
                    console.log("Update Failed")
                    return
                }
                pgpool.query(sql_return_course, [username], (err, rows) => {
                    if (err) {
                        console.log("Failed to find user")
                        return
                    }

                    res.render('postgres/createcourse', { courses: rows.rows, user: req.user });
                })
            })
        }
        else {
            pgpool.query(sql_insert, [daytype, period, coursename, username], (err, rows) => {
                if (err) {
                    console.log(err)
                    return
                }
                pgpool.query(sql_return_course, [username], (err, rows) => {
                    if (err) {
                        console.log("Failed to find user")
                        return
                    }

                    res.render('postgres/createcourse', { courses: rows.rows, user: req.user });
                })
            })
        }
    })

}




exports.course_search = function (req, res, next) {
    res.render('postgres/coursesearch', { formData: {}, errors: {}, user: req.user });
}

exports.course_list = function (req, res, next) {
    const daytype = req.body.daytype.toUpperCase()
    const period = req.body.period
    const coursename = req.body.coursename.toUpperCase()
    const username = req.user.email
    console.log(req.user.email)
    const sql = "SELECT * FROM courseschedule WHERE (upper(daytype) = $1 or period = $2 or upper(coursename) = $3) and username = $4"
    pgpool.query(sql, [daytype, period, coursename, username], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find courses")
            return
        }
        //res.status(200).json(rows.rows)
        console.log(rows.rows)

        res.render('postgres/courselist', { courses: rows.rows, user: req.user })
    })
}



exports.course_edit = function (req, res, next) {
    const courseid = req.body.courseid
    console.log("courseid", courseid)
    const sql = "SELECT * FROM courseschedule WHERE id = $1"
    pgpool.query(sql, [courseid], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find user")
            return
        }
        console.log(rows.rows)
        res.render('postgres/editcourse', { courses: rows.rows, user: req.user });
    })
}


exports.course_delete = function (req, res, next) {
    const courseid = req.body.courseid
    console.log("courseid", courseid)
    const sql_delete = "DELETE FROM courseschedule WHERE id = $1"
    pgpool.query(sql_delete, [courseid], (err, rows) => {
        if (err) {
            console.log("Failed to find user")
            return
        }
    })

    const sql_query = "SELECT * FROM courseschedule WHERE id = $1"
    pgpool.query(sql_query, [courseid], (err, rows) => {
        if (err) {
            console.log("Failed to find user")
            return
        }
        console.log(rows.rows)
        res.render('postgres/createcourse', { courses: rows.rows, user: req.user });
    })
}



exports.show_cheatsheet = function (req, res, next) {
    const sql_query = "SELECT * FROM cheatsheet order by ts desc LIMIT 10"
    pgpool.query(sql_query, [], (err, rows) => {
        if (err) {
            console.log("Failed to find user")
            return
        }
        console.log(rows.rows)
        res.render('postgres/cheatsheet', { cheatsheet: rows.rows, user: req.user });
    })

}

exports.sheet_create = function (req, res, next) {
    const functionality = req.body.functionality
    const syntax = req.body.syntax
    const sql_insert = "INSERT INTO cheatsheet (functionality, syntax) values ($1,$2)"
    pgpool.query(sql_insert, [functionality, syntax], (err, rows) => {
        if (err) {
            console.log("Failed to find user")
            return
        }
        console.log("user name --- ", rows.rows)

        const sql_query = "SELECT * FROM cheatsheet order by ts desc LIMIT 10"
        pgpool.query(sql_query, [], (err, rows) => {
            if (err) {
                console.log("Failed to find user")
                return
            }
            res.render('postgres/cheatsheet', { cheatsheet: rows.rows, user: req.user, text: "Record Succesfully Inserted" });
        })
    })
}

//Comments

exports.show_comments = function (req, res, next) {
    const sql_query = "SELECT * FROM comments"
    pgpool.query(sql_query, [], (err, rows) => {
        if (err) {
            console.log("Failed to find user")
            return
        }
        //console.log(rows.rows)
        res.render('postgres/comments', { texts: '', comments: rows.rows, user: req.user });
    })

}

exports.site_comments = function (req, res, next) {
    const title = req.body.title
    const commenttext = req.body.commenttext
    const username = req.user.email


    if (username) {

        const sql_select = "SELECT * FROM emaillist WHERE email IS NOT null"
        pgpool.query(sql_select, [], (err, rows) => {
            if (err) {
                console.log("Failed to find user")
                return
            }


            for (i = 0; i < rows.rows.length; i++) {
                console.log(rows.rows[i].email)

                try {
                    var mailOptions = {
                        from: 's.jeffery.ye@gmail.com',
                        //to: req.user.email,
                        to: rows.rows[i].email,
                        subject: 'Re: ' + title,
                        html: 'Dear ' + rows.rows[i].first_name + ', <br /> Thank you for your comment. The comment has been recieved. <br /> <b>' + commenttext + '<b> <br /> Thank you, ~ Web Dev'
                        //Alternate Version:  text: 'Thank you for your comment. The comment has been recieved. <br /> <b>' + commenttext + '<b> <br /> Thank you, ~ Web Dev'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                } catch (err) {
                    console.log("Email Sending Error Caught")
                    var mailOptions = {
                        from: 's.jeffery.ye@gmail.com',
                        to: 's.jeffery.ye@gmail.com',
                        subject: 'Error Captured',
                        html: 'site_comments Error.'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    continue;
                }


            }



        })

    }


    const sql_insert = "INSERT INTO comments (title, commenttext, username) values ($1,$2,$3)"
    pgpool.query(sql_insert, [title, commenttext, username], (err, rows) => {
        if (err) {
            console.log("Failed to find user")
            return
        }

        console.log("user name --- ", rows.rows)
        const sql_query = "SELECT * FROM comments"
        pgpool.query(sql_query, [], (err, rows) => {
            if (err) {
                console.log("Failed to find user")
                return
            }
            //console.log(rows.rows)
            res.render('postgres/comments', { texts: 'Message Recieved', comments: rows.rows, user: req.user });
        })

    })
}
