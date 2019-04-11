var express = require('express');
var router = express.Router();

/* GET postgres controller */
let postgres = require('../controllers/postgres');

//Courses

router.get('/coursesearch', postgres.course_search);
router.post('/courselist', postgres.course_list);


router.get('/createcourse', postgres.create_course)
router.post('/createcourse', postgres.insert_course)

router.post('/courseedit', postgres.course_edit)
router.post('/coursedelete', postgres.course_delete)

//Users

router.get('/createnewuser', postgres.create_user);
router.post('/createuseroutput', postgres.user_created);


router.get('/usersearch', postgres.search_user);
router.post('/usersearchresults', postgres.search_results);


//Cheat Sheet

router.get('/cheatsheet', postgres.show_cheatsheet)
router.post('/cheatsheet', postgres.sheet_create)

//Comments

router.get('/comments', postgres.show_comments)
router.post('/comments', postgres.site_comments)

module.exports = router;
