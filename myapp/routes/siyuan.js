var express = require('express');
var router = express.Router();


let user = require('../controllers/user');

let {isLoggedIn, hasAuth} = require('../middleware/hasAuth.js')

router.get('/', );

module.exports = router;