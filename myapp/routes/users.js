var express = require('express');
var router = express.Router();


var Recaptcha = require('express-recaptcha').RecaptchaV2;
var recaptcha = new Recaptcha('6LfkCJ4UAAAAAJqH9azrZG38qCKLarQbMq6IBred', '6LfkCJ4UAAAAAO3bBu76jKEbqZcqwk8NDvjRorF9');
var options = {'hl':'de'};
var recaptcha = new Recaptcha('6LfkCJ4UAAAAAJqH9azrZG38qCKLarQbMq6IBred', '6LfkCJ4UAAAAAO3bBu76jKEbqZcqwk8NDvjRorF9', options);

console.log("routes captcha test", recaptcha)
//let user = require('../controllers/user');

//let landing = require('../controllers/landing');
let user = require('../controllers/user');

let {isLoggedIn, hasAuth} = require('../middleware/hasAuth.js')


router.get('/signup', user.show_signup);
router.post('/signup', user.signup);

router.get('/login',  recaptcha.middleware.render, user.show_login);
router.post('/login', recaptcha.middleware.verify, user.login);

router.post('/logout', user.logout);
router.get('/logout', user.logout);


router.get('/usersearch', user.search_user);


/* postgres query. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
