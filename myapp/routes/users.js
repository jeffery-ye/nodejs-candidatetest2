var express = require('express');
var router = express.Router();

//let user = require('../controllers/user');

//let landing = require('../controllers/landing');
let user = require('../controllers/user');

let {isLoggedIn, hasAuth} = require('../middleware/hasAuth.js')


router.get('/signup', user.show_signup);
router.post('/signup', user.signup);

router.get('/login', user.show_login);
router.post('/login', user.login);

router.post('/logout', user.logout);
router.get('/logout', user.logout);


router.get('/usersearch', user.search_user);


/* postgres query. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
